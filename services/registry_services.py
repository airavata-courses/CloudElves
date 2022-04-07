import json
import logging
import os
from time import sleep

import requests as rq

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

class RegistryServices:
    def __init__(self):
        self.domain = os.getenv('registry_host') or 'http://149.165.152.104:30001'
        self.session = rq.session()

    def jsonprint(self, obj):
        text = json.dumps(obj, indent=4)
        return text

    def get_all_nexrad_data(self):
        requestUrl = self.domain + "/nexrad/all"
        try:
            response = self.session.get(requestUrl)
            response_body = response.json()
        except Exception as e:
            log.error(e)
            raise Exception("error while downloading nexrad bulk data: {}".format(e))
        return self.jsonprint(response_body)

    def get_nexrad_data(self, start_time, end_time, radar_name):
        parameters = {'startTime': str(start_time), 'endTime': str(end_time), 'radarName': radar_name}
        log.info('querying registry for nexrad data for parameters: {}'.format(parameters))
        requestUrl = self.domain + "/nexrad"
        try:
            response = self.session.get(requestUrl, params=parameters)
            response_body = response.json()
            if response.status_code == 200:
                if response_body['status'] == 2:
                    return True, response_body['dataS3Key']
                else:
                    while True:
                        sleep(2)
                        res = self.session.get(requestUrl, params=parameters)
                        res_body = res.json()
                        if res.status_code == 200 and res_body['status'] == 2:
                            return True, res_body['dataS3Key']
                        elif res.status_code == 404:
                            return False, None
            else:
                log.error("requested data not found")
                return False, None
        except Exception as e:
            log.error(e)
            raise Exception("Error while downloading data from Nexrad for given parameters: {}".format(e))

    def get_mera_data(self, dates, variable):
        requestUrl = self.domain + "/mera"
        data = {'dates': list(dates), 'variable': variable}
        log.info('data: {}'.format(data))
        try:
            response = self.session.post(requestUrl, json=data)
            if response.status_code == 200:
                log.info('successfully queried registry for mera data for dates: {} and variable: {}'.format(dates, variable))
                responseBody = response.json()
                log.info('responseBody: {}'.format(responseBody))
                return responseBody['completed'], responseBody['inProgress'], responseBody['unavailable']
        except Exception as e:
            errorMessage = 'error while querying mera data from registry: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)
        
    def cache_nexrad_data(self, capacity):
        bulk_data = self.get_all_nexrad_data()
        bulk_data = json.loads(bulk_data)
        bulk_data.sort(key=lambda x: x['lastAccessTime'])
        valid_s3_keys = []
        try:
            for user_req in bulk_data:
                if user_req['status'] == 2:
                    valid_s3_keys.append(user_req['dataS3Key'])
            num_extra_data = len(valid_s3_keys) - capacity
            if num_extra_data > 0:
                return valid_s3_keys[:num_extra_data]
            else:
                return []
        except Exception as e:
            log.error(e)
            raise Exception("error while caching nexrad data :{}".format(e))

    def update_nexrad_registry(self, data_source, data):
        if data_source == 'nexrad':
            requestUrl = self.domain + '/nexrad/update'
        else:
            requestUrl = self.domain + '/mera/update'
        response = self.session.post(requestUrl, json=data)
        if response.status_code != 200:
            errorMessage = 'error while updating registry: http status code {}'.format(response.status_code)
            log.error(errorMessage)
            raise Exception(errorMessage)
        log.info('successfully updated registry')

