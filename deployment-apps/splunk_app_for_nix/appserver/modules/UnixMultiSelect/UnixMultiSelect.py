import json
import logging
import os
import sys

import cherrypy
import controllers.module as module
import splunk
import splunk.search
import splunk.util
import lib.util as util
from splunk.appserver.mrsparkle.lib import jsonresponse

logger = logging.getLogger('splunk.appserver.controllers.module.UnixMultiSelect')

class UnixMultiSelect(module.ModuleHandler):

    def generateResults(self, host_app, client_app, sid, count=None):
        logger.info("multiselect hit")
        output = {'results': [] } 
        job = splunk.search.JobLite(sid)
        rs = job.getResults('results', count=count)
        for row in rs.results(): 
            for field in row:
                output['results'].append(str(row[field]))
                break
        logger.error(output)
        return self.render_json(output)

    def render_json(self, response_data, set_mime='text/json'):
        cherrypy.response.headers['Content-Type'] = set_mime
        if isinstance(response_data, jsonresponse.JsonResponse):
            response = response_data.toJson().replace("</", "<\\/")
        else:
            response = json.dumps(response_data).replace("</", "<\\/")
        return ' ' * 256  + '\n' + response
