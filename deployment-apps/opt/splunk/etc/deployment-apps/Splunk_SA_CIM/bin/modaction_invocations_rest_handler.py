import httplib
import json
import logging
import operator
import sys
import time

if sys.platform == "win32":
    import os, msvcrt
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

import splunk
import splunk.rest
import splunk.search

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path


class GMTimeFormatter(logging.Formatter):
    """ An extension to the logging.Formatter base class
    Hardcodes "+0000" into default datefmt
    Use in conjunction with ModularActionFormatter.converter = time.gmtime
    """

    converter = time.gmtime

    def formatTime(self, record, datefmt=None):
        """
        Return the creation time of the specified LogRecord as formatted text.

        This method should be called from format() by a formatter which
        wants to make use of a formatted time. This method can be overridden
        in formatters to provide for any specific requirement, but the
        basic behaviour is as follows: if datefmt (a string) is specified,
        it is used with time.strftime() to format the creation time of the
        record. Otherwise, the ISO8601 format is used. The resulting
        string is returned. This function assumes time.gmtime() as the 
        'converter' attribute in the Formatter class.
        """
        ct = self.converter(record.created)
        if datefmt:
            s = time.strftime(datefmt, ct)
        else:
            t  = time.strftime("%Y-%m-%d %H:%M:%S", ct)
            s  = "%s,%03d+0000" % (t, record.msecs)
        return s


## Setup the logger
def setup_logger():
    """
    Setup a logger for the search command
    """
   
    logger = logging.getLogger('modactions_invocations_rest_handler')
    logger.propagate = False  # Prevent the log messages from being duplicated in the python.log file
    logger.setLevel(logging.DEBUG)
   
    file_handler = logging.handlers.RotatingFileHandler(make_splunkhome_path(['var', 'log', 'splunk', 'modaction_invocations_rest_handler.log']), maxBytes=25000000, backupCount=5)
    formatter = GMTimeFormatter('%(asctime)s %(levelname)s %(message)s')
    file_handler.setFormatter(formatter)
   
    logger.addHandler(file_handler)
   
    return logger

logger = setup_logger()

class ModularActionInvocationErrors(object):
    """Enum for error strings"""

    ERR_INVALID_ARG = 'Invalid argument provided'


class ModularActionInvocationsRestHandler(PersistentServerConnectionApplication):
    """REST handler to return responses given sid/rid."""

    MODULAR_ACTION_INVOCATIONS_SEARCH = '| `modular_action_invocations({},{})`'

    def __init__(self, command_line, command_arg):
        
        super(ModularActionInvocationsRestHandler, self).__init__()

    def handle(self, args):
        logger.debug('ARGS: %s', args)

        args = json.loads(args)

        try:
            logger.info('Handling %s request.' % args['method'])
            method = 'handle_' + args['method'].lower()
            if callable(getattr(self, method, None)):
                return operator.methodcaller(method, args)(self)
            else:
                return self.response('Invalid method for this endpoint', httplib.METHOD_NOT_ALLOWED)
        except ValueError as e:
            msg = 'ValueError: %s' % e.message
            return self.response(msg, httplib.BAD_REQUEST)
        except splunk.RESTException as e:
            return self.response('RESTexception: %s' % e, httplib.INTERNAL_SERVER_ERROR)
        except Exception as e:
            msg = 'Unknown exception: %s' % e
            logger.exception(msg)
            return self.response(msg, httplib.INTERNAL_SERVER_ERROR)

    @staticmethod
    def response(msg, status):
        """
        Return a dict for endpoint REST response.

        Arguments:
        msg -- Result of the request
        status -- HTTP response status
        """

        if status < 400:
            payload = msg
        else:
            # replicate controller's jsonresponse format
            payload = {
                "success": False,
                "messages": [{'type': 'ERROR', 'message': msg}],
                "responses": [],
            }
        return {'status': status, 'payload': payload}

    def validate_args(self, sid, rid):
        """
        Validate input arguments.
        
        Arguments:
        sid - sid of an event.
        rid - rid of an event.
        """

        if (sid and isinstance(sid, basestring)) and (rid and isinstance(rid, basestring)):
            pass
        else:
            raise ValueError(ModularActionInvocationErrors.ERR_INVALID_ARG)

        return sid, rid
    
    def get_search_string(self, sid, rid):
        """
        Return search string.
        
        Arguments: 
        sid - sid of an event.
        rid - rid of an event.
        
        Returns:
        Splunk search string.

        Throws:
        ValueError.
        """

        if sid and rid:
            return self.MODULAR_ACTION_INVOCATIONS_SEARCH.format(sid, rid)
        else:
            raise ValueError(ModularActionInvocationErrors.ERR_INVALID_ARG)

    def result_to_dict(self, resultset):
        '''Take a splunk.search.ResultSet object and turn it into a dictionary
        that has a simple representation.

        Return: A dictionary of field values.
        '''
        result = {}
        for key, field in resultset.fields.iteritems():
            result[key] = str(field) 
        return result
    
    def run_search(self, sid, rid, session_key=None):
        """
        Given rid, sid of an event, return action_names, action_mode
        of that event.
        
        Arguments:
        sid - sid of an event.
        rid - rid of an event.
        
        Returns:
        A dictionary containing results.
        
        Throws:
        splunk.SearchException if the search fails.
        """

        rv =  {"success": False, "responses": []}

        search_string = self.get_search_string(sid, rid)
        srch = splunk.search.dispatch(search_string, sessionKey=session_key)

        rv['search_id'] = srch.sid
        rv['search'] = srch.search
        for result in srch.results:
            rv['responses'].append(self.result_to_dict(result))

        if len(rv['responses']) == 0:
            rv['success'] = False
        else:
            rv['success'] = True

        return rv

    def get_modaction_invocations(self, sid, rid, session_key=None):
        """
        Get all the invocations of an event given it's sid and rid.

        Arguments:
        sid - Search id.
        rid - Result id.

        Returns: A JSON object.
        """

        logger.debug("sid: %s, rid: %s", sid, rid)
        
        try:
            valid_sid, valid_rid = self.validate_args(sid, rid)
        except ValueError as exc:
            msg = 'Invalid request: sid="{}" rid="{}" exc="{}"'.format(sid, rid, exc)
            logger.exception(msg)
            return self.response(msg, httplib.BAD_REQUEST)

        try:
            return self.response(self.run_search(valid_sid, valid_rid, session_key), httplib.OK)
        except Exception as exc:
            msg = 'Search for invocations failed: sid="{}" rid="{}" exc="{}"'.format(valid_sid, valid_rid, exc)
            logger.exception(msg)
            return self.response(msg, httplib.INTERNAL_SERVER_ERROR)        

    def handle_get(self, args):
        logger.debug('GET ARGS %s', args)
        
        query = dict(args.get("query", []))
        try:
            session_key = args["session"]["authtoken"]
        except KeyError:
            return self.response("Failed to obtain auth token", httplib.UNAUTHORIZED)

        required = ['sid', 'rid']
        missing = [r for r in required if r not in query]
        if missing:
            return self.response("Missing required arguments: %s" % missing, httplib.BAD_REQUEST)

        sid = query.pop('sid')
        rid = query.pop('rid')
                
        return self.get_modaction_invocations(sid, rid, session_key)
