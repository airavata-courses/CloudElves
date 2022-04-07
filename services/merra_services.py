import datetime
import json
import os
import shutil
import sys
import threading
import time
import uuid
import warnings
from datetime import date, timedelta
from functools import partial
from os.path import exists
from time import sleep

import cartopy.crs as ccrs
import certifi
import matplotlib
matplotlib.use('Agg')
import matplotlib.animation as animation
import matplotlib.pyplot as plt
import numpy as np
import requests
import urllib3
import xarray as xr
import zarr

warnings.filterwarnings("ignore")

from commons import utils
from producer import publisher
from services.registry_services import RegistryServices
from services.s3_services import S3Service
from services.redis_service import RedisService

import logging

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s {%(pathname)s:%(lineno)d}: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

class MerraService:
    # ===================================================================================================================
    def __init__(self) -> None:
        self.results_bucket = os.getenv('merra_results_bucket') or 'results'
        self.download_loc = os.getenv('merra_download_loc') or './merra_downloads'
        self.local_cache_dir = os.getenv('l1_cache_loc') or './local_cache'
        self.l1_cache_capacity = os.getenv('l1_cache_capacity') or 10
        self.registry_queue = os.getenv('registry_op_queue') or 'elves.registry.ingestor.in'
        self.format = os.getenv('data_conversion_format') or 'zarr'
        self.mutex = threading.Lock()
        # Downloads
        if self.download_loc[len(self.download_loc) - 1] == '/':
            self.download_loc = self.download_loc[:len(self.download_loc) - 1]
        if not os.path.exists(self.download_loc):
            os.mkdir(self.download_loc)
        # Local Caches
        if self.local_cache_dir[len(self.local_cache_dir) - 1] == '/':
            self.local_cache_dir = self.local_cache_dir[:len(self.local_cache_dir) - 1]
        if not os.path.exists(self.local_cache_dir):
            os.mkdir(self.local_cache_dir)
        # Services
        self.redis_service = RedisService()
        self.s3Service = S3Service(self.results_bucket)
        self.publisher = publisher.Publisher()
        self.registryService = RegistryServices()

    # ===================================================================================================================
    def startMerraService(self, id, data):
        try:
            product = data['product']
            startDate = data['startDate']
            endDate = data['endDate']
            varNames = data['varNames']
            outputType = data['outputType'] or 'image'
            log.info('parameters for request {} is {}'.format(id, data))
            format = self.format

            locallyPresentMap = self.checkL1Cache(id, product, startDate, endDate, varNames, format)
            dateList = []
            fileList = []
            for localDate in locallyPresentMap:
                if locallyPresentMap[localDate] == '':
                    dateList.append(localDate)
                else:
                    fileList.append(locallyPresentMap[localDate])
            log.info('files present in L1 cache: {}'.format(fileList))
            log.info('files downloading from l2 cache: {}'.format(dateList))
            zarrFileList = self.check_and_download(id, dateList, product, varNames[0])
            zarrFileList += fileList
            log.info('zarrFileList = {}'.format(zarrFileList))

            for vname in varNames:
                vizFiles = []
                for zf in zarrFileList:
                    if (format == 'COG'):
                        zarrVar = zf.split('.')[-2]
                    else:
                        zarrVar = zf.split('.')[-1]

                    if zarrVar == vname:
                        vizFiles.append(zf)

                print('vizFiles:', vizFiles)

                if (outputType == 'image'):
                    imageFileName = self.visualizeMerra2Image(id, vizFiles, vname, format)
                else:
                    imageFileName = self.visualizeMerra2GIF(id, vizFiles, vname, format)
                log.info("imageFilename: {}".format(imageFileName))
                self.s3Service.upload_file(imageFileName, id)
                log.info('successfully uploaded result to s3 for id {}'.format(id))
                success_payload = utils.generate_result_payload(id, 1, 'successfully completed request', id)
                self.publisher.publish(self.registry_queue, success_payload)

                log.info("Results:\n fileList= {}\n zarrFileList= {}\n imageFileName= {}".format(fileList, zarrFileList, imageFileName))
                return fileList, zarrFileList, imageFileName
        except Exception as e:
            error_message = 'error while processing request {}: {}'.format(id, e)
            log.error(error_message)
            log.critical(e, exc_info=True)
            error_payload = utils.generate_result_payload(id, -1, error_message)
            self.publisher.publish(self.registry_queue, error_payload)
            log.error('processing request {} failed. updated registry'.format(id))
        finally:
            self.cleanup(id)
            self.updateL1Cache()

    # ===================================================================================================================
    def extractDateAndProduct(self, fileName):
        nameComponents = fileName.split('/')
        log.info('after splitting on / {}'.format(nameComponents))
        nameComponents = nameComponents[len(nameComponents) - 1]
        nameComponents = nameComponents.split('.')
        log.info('after splitting on . {}'.format(nameComponents))
        year, month, day = nameComponents[2][:4], nameComponents[2][4:6], nameComponents[2][6:8]
        log.info('{}-{}-{}'.format(year, month, day))
        log.info('{}'.format(nameComponents[3]))
        return '{}-{}-{}'.format(year, month, day), nameComponents[3]

    def check_and_download(self, id, dateList, product, varName):
        format = self.format
        lockList = []
        try:
            completedData, inProgressData, unavailableData = self.registryService.get_mera_data(dateList, varName)
            log.info('waiting on in progress files')

            inProgressDates = inProgressData.keys()
            while True:
                cd, ipd, ud = self.registryService.get_mera_data(inProgressDates, varName)
                if len(ipd) == 0:
                    break
                sleep(2)

            for x in cd:
                completedData[x] = cd[x]
            for x in ud:
                unavailableData.append(x)

            log.info('completed waiting on in progress files')

            # download files from local s3
            log.info('downloading files from local s3 for request id: {}'.format(id))
            cur_download_loc = self.local_cache_dir
            completedFileList = []
            for key in completedData:
                completed = completedData[key]
                zipFilePath = cur_download_loc + '/' + completed['dataS3Key'] + '.zip'
                self.s3Service.download_file(completed['dataS3Key'], zipFilePath)
                unpackFolder = cur_download_loc + '/' + completed['dataS3Key']
                shutil.unpack_archive(zipFilePath, unpackFolder)
                completedFileList.append(unpackFolder)
                os.remove(zipFilePath)
                log.info('successfully downloaded {} from s3'.format(completed['dataS3Key']))

            log.info('downloading unavailable files from mera for request id: {}'.format(id))
            unavailableFileList, unavailableDataIds = [], []
            for unavailableDate in unavailableData:
                lockList.append(self.redis_service.acquire_mera_lock(unavailableDate, varName))
                dataId = str(uuid.uuid4())
                unavailableDataIds.append(dataId)
                expirationTime = int(datetime.datetime.now().timestamp() + 180) * 1000
                update_request = utils.generate_mera_data_update_payload(id, dataId, unavailableDate, varName, 1, expirationTime=expirationTime)
                self.registryService.update_nexrad_registry('mera', update_request)
                jobId, response = self.startMerraDataDownload(product, unavailableDate, unavailableDate, [varName])
                status = self.checkMerraRequestStatus(jobId, response)
                if status == 'Succeeded':
                    urls = self.getResults(jobId)
                    unavailableFileList += self.downloadMerraData(id, urls)
                else:
                    errorMessage = 'failed to download mera data for {} in request {}'.format(unavailableDate, id)
                    log.error(errorMessage)
                    raise Exception(errorMessage)

            zarrFileList = []
            if (format == 'COG'):
                zarrFileList.extend(self.convertDataToCOG(id, unavailableFileList))
            else:
                zarrFileList.extend(self.convertDataToZarr(id, unavailableFileList))

            log.info('zarrFileList: {}'.format(zarrFileList))
            log.info('uploading files to s3')
            for i, zarrFileName in enumerate(zarrFileList):
                # Update zarrFilePath correctly as zarrFileName is a file path now and storing in local_cache
                zarrFilePath = zarrFileName
                actFileName = zarrFileName.split('/')
                actFileName = actFileName[len(actFileName)-1]
                zarrZipFileName = shutil.make_archive(actFileName + '-zip', 'zip', zarrFilePath)
                self.s3Service.upload_file(zarrZipFileName, actFileName)
                os.remove(zarrZipFileName)
                fileDate, fileVar = self.extractDateAndProduct(zarrFileName)
                update_request = utils.generate_mera_data_update_payload(id, unavailableDataIds[i], fileDate, fileVar, 2, s3Keys=actFileName)
                self.registryService.update_nexrad_registry('mera', update_request)
            return zarrFileList + completedFileList
        except Exception as e:
            errorMessage = 'error while downloading mera files: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)
        finally:
            for lock in lockList:
                log.info('releasing lock {}'.format(lock.key))
                self.redis_service.release_lock(lock)

    # ===================================================================================================================
    # Helper Functions
    def generateFileName(self, shortName, dateStr, vname):
        parts = []
        parts.append('MERRA2')
        parts.append(shortName)
        parts.append(dateStr)
        parts.append(vname)
        fileName = '.'.join(parts)
        return fileName

    def createDateFromFileName(self, fileNameStr):
        fileNameStr = fileNameStr.split('.')[2]
        recalcDate = []
        recalcDate.append(fileNameStr[0:4])
        recalcDate.append(fileNameStr[4:6])
        recalcDate.append(fileNameStr[6:8])
        dateStr = '-'.join(recalcDate)
        return dateStr

    def set_file_last_modified(self, file_path, dt):
        dt_epoch = dt.timestamp()
        os.utime(file_path, (dt_epoch, dt_epoch))

    def getFilesByLastAccessTime(self, dirpath):
        a = [s for s in os.listdir(dirpath)]
        a.sort(key=lambda s: os.path.getmtime(os.path.join(dirpath, s)))
        a.reverse()
        return a

    def updateL1Cache(self):
        try:
            # Acquire Lock
            self.mutex.acquire()
            local_cache_dir = self.local_cache_dir
            files = self.getFilesByLastAccessTime(local_cache_dir)
            capactiy = self.l1_cache_capacity
            dir_length = len(os.listdir(local_cache_dir))
            # Delete files from the end of the list
            for index in range(capactiy, dir_length, 1):
                file_loc = local_cache_dir + '/' + files[index]
                if os.path.isfile(file_loc):
                    os.remove(file_loc)
                else:
                    shutil.rmtree(file_loc)
        except Exception as e:
            errorMessage = 'error while updating L1 cache: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)
        finally:
            # Release Lock
            self.mutex.release()

    def cleanup(self, id):
        download_path = self.download_loc + '/' + id
        if os.path.exists(download_path):
            shutil.rmtree(download_path)
            log.info('deleted {}'.format(download_path))

    # ===================================================================================================================
    def checkL1Cache(self, id, product, startDate, endDate, varNames, format):
        try:
            # Acquire Lock
            self.mutex.acquire()

            shortName = product.split('_')[0]
            sd = [int(x) for x in startDate.split("-")]
            ed = [int(x) for x in endDate.split("-")]
            start_date = date(sd[0], sd[1], sd[2])
            end_date = date(ed[0], ed[1], ed[2])
            delta = end_date - start_date  # returns timedelta
            files = {}
            for vname in varNames:
                for i in range(delta.days + 1):
                    day = start_date + timedelta(days=i)
                    dateStr = day.strftime('%Y%m%d')

                    searchString = self.generateFileName(shortName, dateStr, vname)
                    if (format == 'COG'):
                        searchString = searchString + '.tif'
                    print(searchString)
                    local_cache_dir = self.local_cache_dir
                    if os.path.exists(local_cache_dir):
                        file_exists = exists(local_cache_dir + '/' + searchString)
                        print(file_exists)
                        if (file_exists):
                            files[self.createDateFromFileName(searchString)] = local_cache_dir + '/' + searchString
                            # Update last modified time of the file to refresh cache
                            now = datetime.datetime.now()
                            self.set_file_last_modified(local_cache_dir + '/' + searchString, now)
                        else:
                            files[self.createDateFromFileName(searchString)] = ''

            print("amol", files)
            return files
        except Exception as e:
            errorMessage = 'error while checking local data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)
        finally:
            # Release Lock
            self.mutex.release()

    # ===================================================================================================================
    # This method POSTs formatted JSON WSP requests to the GES DISC endpoint URL
    # It is created for convenience since this task will be repeated more than once
    def get_http_data(self, request):
        # Create a urllib PoolManager instance to make requests.
        http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())
        # Set the URL for the GES DISC subset service endpoint
        url = 'https://disc.gsfc.nasa.gov/service/subset/jsonwsp'

        hdrs = {
            'Content-Type': 'application/json',
            'Accept':       'application/json'
            }
        data = json.dumps(request)
        r = http.request('POST', url, body=data, headers=hdrs)
        response = json.loads(r.data)
        # Check for errors
        if response['type'] == 'jsonwsp/fault':
            print('API Error: faulty %s request' % response['methodname'])
            sys.exit(1)
        return response

    # ===================================================================================================================
    def startMerraDataDownload(self, product, begTime, endTime, varListToDownload):
        varNames = varListToDownload
        minlon = -180
        maxlon = 180
        minlat = -90
        maxlat = 90

        diurnalAggregation = '1'
        interp = 'remapbil'
        destGrid = 'cfsr0.5a'

        data_req = []
        for i in range(len(varNames)):
            data_req.append({
                'datasetId': product,
                'variable':  varNames[i]
                })

        # Construct JSON WSP request for API method: subset
        subset_request = {
            'methodname': 'subset',
            'type':       'jsonwsp/request',
            'version':    '1.0',
            'args':       {
                'role':               'subset',
                'start':              begTime,
                'end':                endTime,
                'box':                [minlon, minlat, maxlon, maxlat],
                'crop':               True,
                'diurnalAggregation': diurnalAggregation,
                'mapping':            interp,
                'grid':               destGrid,
                'data':               data_req
                }
            }

        # Submit the subset request to the GES DISC Server
        response = self.get_http_data(subset_request)
        # Report the JobID and initial status
        myJobId = response['result']['jobId']
        print('Job ID: ' + myJobId)
        print('Job status: ' + response['result']['Status'])

        return myJobId, response

    # ===================================================================================================================
    def checkMerraRequestStatus(self, myJobId, response):
        # Construct JSON WSP request for API method: GetStatus
        status_request = {
            'methodname': 'GetStatus',
            'version':    '1.0',
            'type':       'jsonwsp/request',
            'args':       {'jobId': myJobId}
            }

        # Check on the job status after a brief nap
        while response['result']['Status'] in ['Accepted', 'Running']:
            sleep(4)
            response = self.get_http_data(status_request)
            status = response['result']['Status']
            percent = response['result']['PercentCompleted']
            print('Job status: %s (%d%c complete)' % (status, percent, '%'))
        if response['result']['Status'] == 'Succeeded':
            print('Job Finished:  %s' % response['result']['message'])
        else:
            print('Job Failed: %s' % response['fault']['code'])

        return response['result']['Status']

    # ===================================================================================================================
    def getResults(self, myJobId):
        # Construct JSON WSP request for API method: GetResult
        batchsize = 20
        results_request = {
            'methodname': 'GetResult',
            'version':    '1.0',
            'type':       'jsonwsp/request',
            'args':       {
                'jobId':      myJobId,
                'count':      batchsize,
                'startIndex': 0
                }
            }

        # Retrieve the results in JSON in multiple batches
        # Initialize variables, then submit the first GetResults request
        # Add the results from this batch to the list and increment the count
        results = []
        count = 0
        response = self.get_http_data(results_request)
        count = count + response['result']['itemsPerPage']
        results.extend(response['result']['items'])

        # Increment the startIndex and keep asking for more results until we have them all
        total = response['result']['totalResults']
        while count < total:
            results_request['args']['startIndex'] += batchsize
            response = self.get_http_data(results_request)
            count = count + response['result']['itemsPerPage']
            results.extend(response['result']['items'])

        # Check on the bookkeeping
        print('Retrieved %d out of %d expected items' % (len(results), total))

        # =========================================
        # STEP 9
        # Sort the results into documents and URLs
        docs = []
        urls = []
        for item in results:
            try:
                if item['start'] and item['end']: urls.append(item)
            except:
                docs.append(item)

        return urls

    # ===================================================================================================================
    def downloadMerraData(self, id, urls):
        # STEP 10
        # Use the requests library to submit the HTTP_Services URLs and write out the results.
        print('\nHTTP_services output:')
        fileList = []
        for item in urls:
            URL = item['link']
            result = requests.get(URL)
            try:
                result.raise_for_status()
                outfn = item['label']
                cur_download_loc = self.download_loc + '/' + id
                if not os.path.exists(cur_download_loc):
                    os.mkdir(cur_download_loc)
                f = open(cur_download_loc + '/' + outfn, 'wb')
                f.write(result.content)
                f.close()
                fileList.append(cur_download_loc + '/' + outfn)
                print(outfn, "is downloaded")
            except:
                print('Error! Status code is %d for this URL:\n%s' % (result.status.code, URL))
                print('Help for downloading data is at https://disc.gsfc.nasa.gov/data-access')

        print('Downloading is done and find the downloaded files in your current working directory')

        return fileList

    # ===================================================================================================================
    def convertDataToCOG(self, id, fileList):
        try:
            COGFileList = []

            local_cache_dir = self.local_cache_dir

            for filePath in fileList:
                ncfile = xr.open_dataset(filePath)

                for vname in ncfile.data_vars:
                    # Read file
                    pr = ncfile[vname]

                    if (vname == 'time_bnds'):
                        continue

                    # (Optional) convert longitude from (0-360) to (-180 to 180) (if required)
                    pr.coords['lon'] = (pr.coords['lon'] + 180) % 360 - 180
                    pr = pr.sortby(pr.lon)

                    # Define lat/long
                    pr = pr.rio.set_spatial_dims('lon', 'lat')

                    # Check for the CRS
                    pr.rio.crs

                    # (Optional) If your CRS is not discovered, you should be able to add it like so:
                    pr.rio.set_crs("epsg:4326")

                    # Saving the file
                    dateStr = ncfile.attrs['Filename'].split('.')[2]
                    fileNameToStore = self.generateFileName(ncfile.attrs['ShortName'], dateStr, vname) + '.tif'
                    COGFileList.append(local_cache_dir + '/' + fileNameToStore)

                    try:
                        if not os.path.exists(local_cache_dir + '/' + fileNameToStore):
                            # Stores to local cache
                            pr.rio.to_raster(os.getcwd() + '/' + local_cache_dir + '/' + fileNameToStore)
                    except:
                        print('File already exists')

            return COGFileList
        except Exception as e:
            errorMessage = 'error while converting COG data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
    def convertDataToZarr(self, id, fileList):
        try:
            zarrFileList = []

            local_cache_dir = self.local_cache_dir

            for filePath in fileList:
                ds = xr.open_dataset(filePath)

                compressor = zarr.Blosc(cname='zstd', clevel=3)
                for vname in ds.data_vars:
                    # print(vname)
                    if (vname == 'time_bnds'):
                        continue
                    temp_ds = ds[vname].to_dataset()
                    # Saving the file
                    dateStr = ds.attrs['Filename'].split('.')[2]
                    fileNameToStore = self.generateFileName(ds.ShortName, dateStr, vname)
                    zarrFileList.append(local_cache_dir + '/' + fileNameToStore)

                    try:
                        if not os.path.exists(local_cache_dir + '/' + fileNameToStore):
                            # Stores to local cache
                            encoding = {vname: {'compressor': compressor}}
                            temp_ds.to_zarr(store=local_cache_dir + '/' + fileNameToStore, encoding=encoding, consolidated=True)
                    except:
                        print('File already exists')

            return zarrFileList
        except Exception as e:
            errorMessage = 'error while converting zarr data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
    def visualizeMerra2Image(self, id, fileNameList, varName, format):
        try:
            if (not fileNameList):
                print("No filenames present")
                return

            cur_download_loc = self.download_loc + '/' + id

            if (format == 'COG'):
                cog_ds = xr.open_rasterio(fileNameList[0])
                lons = cog_ds['x']
                lats = cog_ds['y']
                T2M = cog_ds.values
                for index in range(1, len(fileNameList)):
                    temp_ds = xr.open_rasterio(fileNameList[index])
                    temp_T2M = temp_ds.values
                    T2M = np.vstack((T2M, temp_T2M))
            else:
                zarr_ds = xr.open_zarr(store=fileNameList[0], consolidated=True)
                lons = zarr_ds[varName]['lon'][:]
                lats = zarr_ds[varName]['lat'][:]
                T2M = zarr_ds[varName][:, :, :]
                # left,bottom,right,top = zarr_ds.rio.bounds()
                for index in range(1, len(fileNameList)):
                    temp_ds = xr.open_zarr(store=fileNameList[index], consolidated=True)
                    temp_T2M = temp_ds[varName][:, :, :]
                    T2M = np.vstack((T2M, temp_T2M))

            # Take mean of all days data
            T2M = np.mean(T2M, axis=0)

            fig = plt.figure(num=id, figsize=(18, 12))
            ax = fig.add_subplot(111)
            ax = plt.axes(projection=ccrs.PlateCarree())
            ax.set_global()
            ax.coastlines(resolution="110m", linewidth=1)
            ax.gridlines(draw_labels=True, linestyle='--', color='black')
            # Set contour levels, then draw the plot and a colorbar
            clevs = np.arange(215, 315, 5)

            if (T2M.ndim == 3):
                cont = ax.contourf(lons, lats, T2M[0], clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)
            else:
                cont = ax.contourf(lons, lats, T2M, clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)

            ax.set_title(f'MERRA-2 - {varName}', size=14)
            cb = fig.colorbar(cont, ax=ax, orientation="vertical", pad=0.02, aspect=24, shrink=0.55)
            cb.set_label('K', size=12, rotation=0, labelpad=15)
            cb.ax.tick_params(labelsize=10)

            if not os.path.exists(cur_download_loc):
                os.mkdir(cur_download_loc)
            # Save as Image
            outputFilePath = f'{cur_download_loc}/image.{varName}.{int(time.time())}.png'
            plt.savefig(outputFilePath)
            return outputFilePath
        except Exception as e:
            errorMessage = 'error while image plotting: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
    def visualizeMerra2GIF(self, id, fileNameList, varName, format):
        try:
            cur_download_loc = self.download_loc + '/' + id

            def animate(i, varToShow, lons, lats, clevs, varName):
                if (varToShow.ndim == 4):
                    cont = plt.contourf(lons, lats, varToShow[0][0], clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)
                elif (varToShow.ndim == 3):
                    cont = plt.contourf(lons, lats, varToShow[0], clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)
                else:
                    cont = plt.contourf(lons, lats, varToShow, clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)

                if (varToShow.ndim == 4):
                    varToShow = varToShow[i]
                for c in cont.collections:
                    c.remove()  # removes only the contours, leaves the rest intact
                cont = plt.contourf(lons, lats, varToShow[i], clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)
                plt.title(f'MERRA-2 - {varName} T: {i + 1}')
                return cont

            if (not fileNameList):
                print("No filenames present")
                return

            if (format == 'COG'):
                cog_ds = xr.open_rasterio(fileNameList[0])
                lons = cog_ds['x']
                lats = cog_ds['y']
                T2M = cog_ds.values
                for index in range(1, len(fileNameList)):
                    temp_ds = xr.open_rasterio(fileNameList[index])
                    temp_T2M = temp_ds.values
                    T2M = np.vstack((T2M, temp_T2M))
            else:
                zarr_ds = xr.open_zarr(store=fileNameList[0], consolidated=True)
                lons = zarr_ds[varName]['lon'][:]
                lats = zarr_ds[varName]['lat'][:]
                T2M = zarr_ds[varName][:, :, :]
                for index in range(1, len(fileNameList)):
                    temp_ds = xr.open_zarr(store=fileNameList[index], consolidated=True)
                    temp_T2M = temp_ds[varName][:, :, :]
                    T2M = np.vstack((T2M, temp_T2M))

            # Set the figure size, projection, and extent
            Nt = len(T2M)
            fig = plt.figure(num=id, figsize=(18, 12))
            ax = fig.add_subplot(111)
            ax = plt.axes(projection=ccrs.PlateCarree())
            ax.set_global()
            ax.coastlines(resolution="110m", linewidth=1)
            ax.gridlines(draw_labels=True, linestyle='--', color='black')

            # Set contour levels, then draw the plot and a colorbar
            clevs = np.arange(215, 315, 5)
            if (T2M.ndim == 4):
                cont = ax.contourf(lons, lats, T2M[0][0], clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)
            elif (T2M.ndim == 3):
                cont = ax.contourf(lons, lats, T2M[0], clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)
            else:
                cont = ax.contourf(lons, lats, T2M, clevs, transform=ccrs.PlateCarree(), cmap=plt.cm.jet)

            ax.set_title(f'MERRA-2 - {varName}', size=14)
            cb = fig.colorbar(cont, ax=ax, orientation="vertical", pad=0.02, aspect=24, shrink=0.55)
            cb.set_label('K', size=12, rotation=0, labelpad=15)
            cb.ax.tick_params(labelsize=10)
            anim = animation.FuncAnimation(fig, func=partial(animate, varToShow=T2M, lons=lons, lats=lats, clevs=clevs, varName=varName), frames=Nt,
                                           interval=500, repeat=True, blit=False)

            if not os.path.exists(cur_download_loc):
                os.mkdir(cur_download_loc)
            # Save as GIF
            outputFilePath = f'{cur_download_loc}/animation.{varName}.{int(time.time())}.gif'
            anim.save(outputFilePath, writer='pillow')
            return outputFilePath
        except Exception as e:
            errorMessage = 'error while gif plotting: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
