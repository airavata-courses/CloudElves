import datetime
import os
import shutil
import uuid
import nexradaws
import pyart

from datetime import datetime
# import tkinter
import matplotlib
matplotlib.use('Agg')
import pylab

from matplotlib import pyplot as plt

from producer import publisher
from services.registry_services import RegistryServices
from services.s3_services import S3Service
from services.redis_service import RedisService

import logging

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s {%(pathname)s:%(lineno)d}: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

class NexradService:

    def __init__(self) -> None:
        self.connection = nexradaws.NexradAwsInterface()
        self.results_bucket = os.getenv('nexrad_results_bucket') or 'results'
        self.download_loc = os.getenv('download_loc') or './nexrad_downloads'
        self.registry_queue = os.getenv('registry_op_queue') or 'elves.registry.ingestor.in'
        self.redis_service = RedisService()
        if self.download_loc[len(self.download_loc) - 1] == '/':
            self.download_loc = self.download_loc[:len(self.download_loc) - 1]
        if not os.path.exists(self.download_loc):
            os.mkdir(self.download_loc)
        self.s3Service = S3Service(self.results_bucket)
        self.publisher = publisher.Publisher()
        self.registryService = RegistryServices()

    def download_and_plot(self, id, data):
        try:
            self.validate_data(data)
            download_source, downloads = self.check_and_download(data, id)
            if download_source == 1:
                plot_location = self.plot_data_from_file(downloads, data['plotType'], id)
            else:
                plot_location = self.plot_data_from_scan(downloads, data['plotType'], id)
            self.s3Service.upload_file(plot_location, id)
            log.info('uploaded plot to local s3 bucket')
            success_payload = self.generate_result_payload(id, 1, 'successfully completed request', id)
            self.publisher.publish(self.registry_queue, success_payload)
            log.info('successfully processed request {}. updated registry'.format(id))
        except Exception as e:
            error_message = 'error while processing request {}: {}'.format(id, e)
            log.error(error_message)
            log.critical(e, exc_info=True)
            error_payload = self.generate_result_payload(id, -1, error_message)
            self.publisher.publish(self.registry_queue, error_payload)
            log.error('processing request {} failed. updated registry'.format(id))
        finally:
            self.cleanup(id)

    # performs validation on requested data.
    def validate_data(self, data):
        log.info("validating payload")
        try:
            if set(data.keys()) != {'year', 'month', 'day', 'radar', 'plotType'}:
                raise Exception("invalid input fields")

            years = self.connection.get_avail_years()
            errorMessage = ''
            if data["year"] not in years:
                errorMessage = '{}: invalid year'.format(data['year'])

            months = self.connection.get_avail_months(data["year"])
            if data["month"] not in months:
                errorMessage = '{}: invalid month'.format(data['month'])

            days = self.connection.get_avail_days(data["year"], data["month"])
            if data["day"] not in days:
                errorMessage = '{}: invalid day'.format(data['day'])

            if errorMessage != '':
                log.error('validation error: {}'.format(errorMessage))
                raise Exception(errorMessage)

            radars = self.connection.get_avail_radars(data["year"], data["month"], data["day"])
            if data["radar"] not in radars:
                errorMessage = '{}: invalid radar'.format(data['radar'])
                log.info(errorMessage)
                raise Exception(errorMessage)
            log.info("successfully validated request data")
        except Exception as e:
            errorMessage = 'error while validating data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    def check_and_download(self, data, id):
        year, month, day = int(data["year"]), int(data["month"]), int(data["day"])
        startTime = int(datetime(year, month, day, 0, 0).timestamp()) * 1000
        endTime = int(datetime(year, month, day, 23, 59).timestamp()) * 1000
        lock = None
        lock_released = False
        try:
            lock = self.redis_service.acquire_nexrad_lock(startTime, endTime, data['radar'])
            dataPresent, s3Keys = self.registryService.get_nexrad_data(startTime, endTime, data['radar'])
            log.info('successfully queried registry for data for id: {}'.format(id))
            if dataPresent:
                self.redis_service.release_lock(lock)
                lock_released = True
                log.info('files present in local s3, downloading')
                return 1, self.download_from_s3(id, s3Keys)
            else:
                log.info('files not present in local s3, downloading from nexrad aws s3')
                return 2, self.download_data(id, data)
        except Exception as e:
            raise Exception(e)
        finally:
            if lock is not None and not lock_released:
                self.redis_service.release_lock(lock)

    def download_from_s3(self, id, s3Keys):
        cur_download_loc = self.download_loc + '/' + id
        os.mkdir(cur_download_loc)
        files = []
        for s3Key in s3Keys.split(','):
            filePath = cur_download_loc + '/' + s3Key.strip()
            self.s3Service.download_file(s3Key.strip(), filePath)
            files.append(filePath)
            log.info('downloaded {} from s3 to {}'.format(s3Key, filePath))
        return files

    # downloads data from nexrad
    def download_data(self, id, data):
        data_id = str(uuid.uuid4())
        year, month, day = int(data["year"]), int(data["month"]), int(data["day"])
        try:
            startTime = datetime(year, month, day, 0, 0)
            endTime = datetime(year, month, day, 23, 59)
            expirationTime = int(datetime.now().timestamp() + 180) * 1000
            update_request = self.generate_data_update_payload(id, data_id, int(startTime.timestamp()) * 1000, int(endTime.timestamp()) * 1000,
                                                               data['radar'],
                                                               0, expirationTime=expirationTime)
            self.registryService.update_nexrad_registry('nexrad', update_request['data'])
            cur_download_loc = self.download_loc + '/' + id
            os.mkdir(cur_download_loc)
            scans = self.connection.get_avail_scans(data["year"], data["month"], data["day"], data["radar"])
            result = self.connection.download(scans[0:4], cur_download_loc)
            logging.info('(from logging) successfully downloaded nexrad files for id {}'.format(id))
            log.info('successfully downloaded nexrad files for id {}'.format(id))
            if len(result.success) == 0:
                errorMessage = 'error while downloading nexrad files for {}'.format(id)
                log.info(errorMessage)
                raise Exception(errorMessage)
            s3Keys = []
            for s in os.listdir(cur_download_loc):
                self.s3Service.upload_file(cur_download_loc + '/' + s, s)
                s3Keys.append(s)
            update_request = self.generate_data_update_payload(id, data_id, int(startTime.timestamp()) * 1000, int(endTime.timestamp()) * 1000,
                                                               data['radar'], 2, s3Keys=','.join(s3Keys))
            self.registryService.update_nexrad_registry('nexrad', update_request['data'])
            return result
        except Exception as e:
            errorMessage = 'error while downloading nexrad files for {}: {}'.format(id, e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    def cleanup(self, id):
        download_path = self.download_loc + '/' + id
        if os.path.exists(download_path):
            shutil.rmtree(download_path)
            log.info('deleted {}'.format(download_path))

    def plot_data_from_file(self, files, plot_type, request_id):
        image_loc = os.getenv('plot_loc') or './plotted_data/'
        if image_loc[len(image_loc) - 1] == '/':
            image_loc = image_loc[:len(image_loc) - 1]

        if not os.path.exists(image_loc):
            os.mkdir(image_loc)
        image_loc = image_loc + '/' + request_id + '.png'
        try:
            fig = plt.figure(figsize=(16, 12))
            for i, scan in enumerate(files):
                ax = fig.add_subplot(2, 2, i + 1)
                radar = pyart.io.read_nexrad_archive(files[i])
                display = pyart.graph.RadarDisplay(radar)
                plot_num = 0 if plot_type == 'reflectivity' else 1
                display.plot(plot_type, plot_num, ax=ax)
                display.set_limits((-150, 150), (-150, 150), ax=ax)
            fig.savefig(image_loc)
            log.info('successfully plotted figure at {}'.format(image_loc))
            return image_loc
        except Exception as e:
            errorMessage = 'error while plotting data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # plots the image out of data retrieved from nexrad.
    def plot_data_from_scan(self, scans, plot_type, request_id):
        image_loc = os.getenv('plot_loc') or './plotted_data/'
        if image_loc[len(image_loc) - 1] == '/':
            image_loc = image_loc[:len(image_loc) - 1]

        if not os.path.exists(image_loc):
            os.mkdir(image_loc)
        image_loc = image_loc + '/' + request_id + '.png'
        try:
            fig = plt.figure(figsize=(16, 12))
            for i, scan in enumerate(scans.iter_success(), start=1):
                ax = fig.add_subplot(2, 2, i)

                radar = scan.open_pyart()
                display = pyart.graph.RadarDisplay(radar)
                display.plot(plot_type, 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
                display.set_limits((-150, 150), (-150, 150), ax=ax)

            fig.savefig(image_loc)
            log.info('successfully plotted figure at {}'.format(image_loc))
            return image_loc
        except Exception as e:
            errorMessage = 'error while plotting data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    def generate_data_update_payload(self, requestId, dataId, startTime, endTime, radarName, status, s3Keys=None, expirationTime=None):
        data = {'dataId': dataId, 'startTime': str(startTime), 'endTime': str(endTime), 'radarName': radarName, 'status': status}
        if expirationTime is not None:
            data['expirationTime'] = str(expirationTime)
        if s3Keys is not None:
            data['dataS3Key'] = s3Keys
        return self.generate_payload(requestId, data)

    def generate_result_payload(self, request_id, status, comments, results_s3_key=None):
        data = {"requestId": request_id, "status": status, "comments": comments}
        if results_s3_key is not None:
            data["resultS3Key"] = results_s3_key
        return self.generate_payload(request_id, data)

    def generate_payload(self, request_id, data):
        return {
            "specversion":     '1.0',
            "type":            'elves.ingestor.getdata',
            "source":          'ingestor',
            "subject":         'ingestor.getdata',
            "id":              request_id,
            "time":            str(int(datetime.now().timestamp())),
            "datacontenttype": 'application/json',
            "data":            data
            }
