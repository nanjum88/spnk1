import logging
import cherrypy
import splunk.appserver.mrsparkle.controllers as controllers
from splunk.appserver.mrsparkle.lib.decorators import expose_page
from splunk.appserver.mrsparkle.lib.routes import route
from splunk.appserver.mrsparkle.lib.util import make_splunkhome_path
import sys
# STREAM-3375: if splunk_app_stream bin path is not present in the sys.path, then add it to sys.path to ensure python modules are loaded
bin_path = make_splunkhome_path(['etc', 'apps', 'splunk_app_stream', 'bin'])
if bin_path not in sys.path:
    sys.path.append(bin_path)
from stream_kvstore_utils import *
from splunk_app_stream.models.streamfwdauth import *

logger = setup_logger('streamfwdauth')

if not is_splunkd_ready():
    logger.error("Exiting since splunkd is not ready")
else:
    logger.info("Initializing streamfwdauth...")

# Controller class to handle the API requests to get StreamfwdAuth

class StreamfwdAuth(controllers.BaseController):
    ''' StreamfwdAuth Controller '''

    @route('/', methods=['GET'])
    @expose_page(must_login=True, methods=['GET'])
    def get(self, **params):
        '''Return stream forwarder auth configuration'''
        sessionKey = cherrypy.session.get('sessionKey')
        result = StreamForwarderAuth.get(sessionKey)
        if 'status' in result:
            cherrypy.response.status = result['status']
        return self.render_json(result)

    @route('/', methods=['POST', 'PUT'])
    @expose_page(must_login=True, methods=['POST', 'PUT'])
    def save(self, **params):
        '''Update stream forwarder auth configuration'''
        sessionKey = cherrypy.session.get('sessionKey')
        try:
            data = self.parse_json_payload()
        except Exception as e:
            logger.exception(e)
            cherrypy.response.status = 400
            return self.render_json({'success': False, 'error': "Bad request", 'status': 400})

        if 'enabled' in data and 'authKey' in data:
            enabled = data['enabled']
            authKey = data['authKey']
        else:
            cherrypy.response.status = 400
            return self.render_json({'success': False, 'error': "Bad request", 'status': 400})

        result = StreamForwarderAuth.save(enabled, authKey, sessionKey)
        if 'status' in result:
            cherrypy.response.status = result['status']
        logger.debug('save::result %s' % result)
        return self.render_json(result)

    def parse_json_payload(self):
            '''Read request payload and parse it as JSON'''
            body = cherrypy.request.body.read()
            if not body:
                raise Exception('request payload empty')
            try:
                data = json.loads(body)
            except Exception as e:
                logger.exception(e)
                raise Exception('could not parse JSON payload')
            return data
