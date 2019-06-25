#!/usr/bin/env python
# Copyright (C) 2015-2017 Splunk Inc. All Rights Reserved.
import errno
import gc
import os

import pandas as pd

import cexc
import conf
import models.base

from BaseProcessor import BaseProcessor
from util import search_util

logger = cexc.get_logger(__name__)
messages = cexc.get_messages_logger()


class ApplyProcessor(BaseProcessor):
    """The apply processor receives and returns pandas DataFrames."""

    def __init__(self, process_options, searchinfo):
        """Initialize options for the processor.

        Args:
            process_options (dict): process options
            searchinfo (dict): information required for search
        """
        self.searchinfo = searchinfo
        self.algo_name, self.algo, self.process_options, self.namespace = self.setup_model(process_options, self.searchinfo)
        self.resource_limits = self.load_resource_limits(self.algo_name)

    def get_relevant_fields(self):
        """Return the needed feature variables.

        Returns:
            relevant_fields (list): relevant fields
        """
        relevant_fields = self.process_options['feature_variables']

        # TODO MLA-1589: require explicit _* usage
        if '*' in relevant_fields:
            relevant_fields.append('_*')

        return relevant_fields

    @classmethod
    def setup_model(cls, process_options, searchinfo):
        """Load temp model, try to load real model, update options.

        Remove the tmp_dir in the process.

        Args:
            process_options (dict): process_options
            searchinfo (dict): information required for search
        Returns:
            algo_name (str): algorithm name
            algo (object): algorithm object
            process_options (dict): updated process options
        """
        tmp_dir = process_options.pop('tmp_dir')

        searchinfo = search_util.add_distributed_search_info(process_options, searchinfo)

        namespace = process_options.pop('namespace', None)
        try:
            algo_name, _, model_options = models.base.load_model(
                process_options['model_name'],
                searchinfo,
                namespace=namespace,
                model_dir=tmp_dir,
                skip_model_obj=True,
                tmp=True
            )
            algo = None
            logger.debug('Using tmp model to set required_fields.')
        except:
            # Try to load real model.
            try:
                algo_name, algo, model_options = models.base.load_model(
                    process_options['model_name'],
                    searchinfo,
                    namespace=namespace)
            except (OSError, IOError) as e:
                if e.errno == errno.ENOENT:
                    raise RuntimeError('model "%s" does not exist.' % process_options['model_name'])
                raise RuntimeError('Failed to load model "%s": %s.' % (
                    process_options['model_name'], str(e)))
            except Exception as e:
                cexc.log_traceback()
                raise RuntimeError('Failed to load model "%s": %s.' % (
                    process_options['model_name'], str(e)))

        model_options.update(process_options)  # process options override loaded model options
        process_options = model_options
        return algo_name, algo, process_options, namespace

    @staticmethod
    def load_resource_limits(algo_name):
        """Load algorithm-specific limits.

        Args:
            algo_name (str): algorithm name

        Returns:
            resource_limits (dict): dictionary of resource limits
        """
        resource_limits = {}
        resource_limits['max_memory_usage_mb'] = int(
            conf.get_mlspl_prop('max_memory_usage_mb', algo_name, -1))
        return resource_limits

    @staticmethod
    def apply(df, algo, process_options):
        """Perform the literal predict from the estimator.

        Args:
            df (dataframe): input data
            algo (object): initialized algo object
            process_options (dict): process options

        Returns:
            prediction_df (dataframe): output dataframe
        """
        try:
            prediction_df = algo.apply(df, options=process_options)
            gc.collect()

        except Exception as e:
            cexc.log_traceback()
            cexc.messages.warn('Error while applying model "%s": %s' % (process_options['model_name'], str(e)))
            raise RuntimeError(e)

        return prediction_df

    def process(self):
        """If algo isn't loaded, load the model. Create the output dataframe."""
        if self.algo is None:
            self.algo_name, self.algo, _ = models.base.load_model(self.process_options['model_name'], self.searchinfo, namespace=self.namespace)
        if len(self.df) > 0:
            self.df = self.apply(self.df, self.algo, self.process_options)
        if self.df is None:
            messages.warn('Apply method did not return any results.')
            self.df = pd.DataFrame()
