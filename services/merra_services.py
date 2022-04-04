from netCDF4 import Dataset
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
from cartopy.mpl.gridliner import LONGITUDE_FORMATTER, LATITUDE_FORMATTER
import cartopy.feature as cfeature
import matplotlib.ticker as mticker
import matplotlib.animation as animation
from functools import partial

import sys
import time
from datetime import date, timedelta
import json
import urllib3
import certifi
import requests
from time import sleep
from http.cookiejar import CookieJar
import urllib.request
from urllib.parse import urlencode
from os.path import exists
import xarray as xr
import rioxarray as rio
import zarr
import os
import warnings
import datetime
warnings.filterwarnings("ignore")

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
        # self.connection = nexradaws.NexradAwsInterface()
        self.results_bucket = os.getenv('nexrad_results_bucket') or 'merraresults'
        self.download_loc = os.getenv('nexrad_download_loc') or './merra_downloads'
        self.registry_queue = os.getenv('registry_op_queue') or 'elves.registry.ingestor.in'
        self.redis_service = RedisService()
        if self.download_loc[len(self.download_loc) - 1] == '/':
            self.download_loc = self.download_loc[:len(self.download_loc) - 1]
        if not os.path.exists(self.download_loc):
            os.mkdir(self.download_loc)
        self.s3Service = S3Service(self.results_bucket)
        self.publisher = publisher.Publisher()
        self.registryService = RegistryServices()
        self.format = os.getenv('data_conversion_format') or 'zarr'
    
    def startMerraService(self, id, data):
        try:
            product = data['product']
            startDate = data['startDate']
            endDate = data['endDate']
            varNames = data['varNames']
            outputType = data['outputType'] or 'image'
            userId = data['userId']

            format = self.format
            
            # CHECK WITH REGISTRY FOR LOCAL DATA AVAILABILITY
            # existingDataURLS = checkWithRegistry(product,startDate,endDate,varNames)
            
            existingFiles,newRequestParams = self.isFilesPresentInCache(id,product,startDate,endDate,varNames,format)

            zarrFileList = existingFiles

            print(existingFiles, newRequestParams)
                    
            for req in newRequestParams:
                newStartDate = req['startDate']
                newEndDate = req['endDate']
                newVarNames = req['vname']
            
                jobId,response = self.startMerraDataDownload(product,newStartDate,newEndDate,newVarNames)

                # SET REGISTRY - Download Job Started
                # success_payload = self.generate_result_payload(id, 1, 'successfully completed request', _)
                # self.publisher.publish(self.registry_queue, success_payload)
                # log.info('successfully processed request {}. updated registry'.format(id))

                status = self.checkMerraRequestStatus(jobId,response)

                if status == 'Succeeded':

                    # SET REGISTRY - Downloading Data

                    urls = self.getResults(jobId)
                    fileList = self.downloadMerraData(id, urls)    # Downloads the data locally
                else:
                    # SET REGISTRY - Download Job Failed
                    pass
                    return

                # SET REGISTRY - Data Conversion Job Started

                if(format == 'COG'):
                    zarrFileList.extend(self.convertDataToCOG(id, fileList))
                else:
                    zarrFileList.extend(self.convertDataToZarr(id, fileList))

            # -------------------------------------------------------------------------
                
            # SET REGISTRY - Visualization Job Started

            print("zf",zarrFileList)
            for vname in varNames:
                vizFiles = []
                for zf in zarrFileList:
                    if(format == 'COG'):
                        zarrVar = zf.split('.')[-2]
                    else:
                        zarrVar = zf.split('.')[-1]
                    
                    if zarrVar == vname:
                        vizFiles.append(zf)
                
                print(vizFiles)
                if(outputType == 'image'):
                    self.visualizeMerra2Image(id, vizFiles,vname,format)
                else:
                    self.visualizeMerra2GIF(id, vizFiles,vname,format)

            # SET REGISTRY - Job Completed

            # if(dataConvStatus == "Success"):
            #     deleteLocalData(urls)
        except Exception as e:
            error_message = 'error while processing request {}: {}'.format(id, e)
            log.error(error_message)
            error_payload = self.generate_result_payload(id, -1, error_message)
            self.publisher.publish(self.registry_queue, error_payload)
            log.error('processing request {} failed. updated registry'.format(id))
        finally:
            pass
            # self.cleanup(id)
    
    # ===================================================================================================================
    def generatePayload(self, action="elves.ingetor.getdata", comments="500: Internal Server Error", encoded_image="",
                        event_type="elves.registry.applog.in", id="", source="ingestor", specversion="1.0", status="2",
                        subject="", user="", datacontenttype="application/json"):
        return {
            "specversion":     specversion,
            "type":            event_type,
            "source":          source,
            "subject":         subject,
            "id":              id,
            "time":            str(datetime.datetime.now()),
            "datacontenttype": datacontenttype,
            "data":            {
                "action":   action,
                "id":       id,
                "userId":   user,
                "image":    encoded_image,
                "comments": comments,
                "status":   status
                }
            }

    # ===================================================================================================================
    # This method POSTs formatted JSON WSP requests to the GES DISC endpoint URL
    # It is created for convenience since this task will be repeated more than once
    def get_http_data(self, request):
        # Create a urllib PoolManager instance to make requests.
        http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED',ca_certs=certifi.where())
        # Set the URL for the GES DISC subset service endpoint
        url = 'https://disc.gsfc.nasa.gov/service/subset/jsonwsp'
        
        hdrs = {'Content-Type': 'application/json',
                'Accept'      : 'application/json'}
        data = json.dumps(request)       
        r = http.request('POST', url, body=data, headers=hdrs)
        response = json.loads(r.data)   
        # Check for errors
        if response['type'] == 'jsonwsp/fault' :
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
            data_req.append({'datasetId': product,
                        'variable' : varNames[i]
                        })
        
        # Construct JSON WSP request for API method: subset
        subset_request = {
            'methodname': 'subset',
            'type': 'jsonwsp/request',
            'version': '1.0',
            'args': {
                'role'  : 'subset',
                'start' : begTime,
                'end'   : endTime,
                'box'   : [minlon, minlat, maxlon, maxlat],
                'crop'  : True,
                'diurnalAggregation': diurnalAggregation,
                'mapping': interp,
                'grid'  : destGrid,
                'data': data_req
            }
        }

        # Submit the subset request to the GES DISC Server
        response = self.get_http_data(subset_request)
        # Report the JobID and initial status
        myJobId = response['result']['jobId']
        print('Job ID: '+myJobId)
        print('Job status: '+response['result']['Status'])

        return myJobId, response

    # ===================================================================================================================
    def checkMerraRequestStatus(self, myJobId, response):
        # Construct JSON WSP request for API method: GetStatus
        status_request = {
            'methodname': 'GetStatus',
            'version': '1.0',
            'type': 'jsonwsp/request',
            'args': {'jobId': myJobId}
        }

        # Check on the job status after a brief nap
        while response['result']['Status'] in ['Accepted', 'Running']:
            sleep(4)
            response = self.get_http_data(status_request)
            status  = response['result']['Status']
            percent = response['result']['PercentCompleted']
            print ('Job status: %s (%d%c complete)' % (status,percent,'%'))
        if response['result']['Status'] == 'Succeeded' :
            print ('Job Finished:  %s' % response['result']['message'])
        else : 
            print('Job Failed: %s' % response['fault']['code'])
        
        return response['result']['Status']

    # ===================================================================================================================
    def getResults(self, myJobId):
        # Construct JSON WSP request for API method: GetResult
        batchsize = 20
        results_request = {
            'methodname': 'GetResult',
            'version': '1.0',
            'type': 'jsonwsp/request',
            'args': {
                'jobId': myJobId,
                'count': batchsize,
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
        while count < total :
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
        for item in results :
            try:
                if item['start'] and item['end'] : urls.append(item) 
            except:
                docs.append(item)

        return urls

    # ===================================================================================================================
    def downloadMerraData(self, id, urls):
        # STEP 10 
        # Use the requests library to submit the HTTP_Services URLs and write out the results.
        print('\nHTTP_services output:')

        fileList = []
        for item in urls :
            URL = item['link'] 
            result = requests.get(URL)
            try:
                result.raise_for_status()
                outfn = item['label']
                cur_download_loc = self.download_loc + '/' + id
                if not os.path.exists(cur_download_loc):
                    os.mkdir(cur_download_loc)
                f = open(cur_download_loc + '/' + outfn,'wb')
                f.write(result.content)
                f.close()
                fileList.append(outfn)
                print(outfn, "is downloaded")
            except:
                print('Error! Status code is %d for this URL:\n%s' % (result.status.code,URL))
                print('Help for downloading data is at https://disc.gsfc.nasa.gov/data-access')
                
        print('Downloading is done and find the downloaded files in your current working directory')

        return fileList

    # ===================================================================================================================
    def deleteLocalData(self, urls):
        for item in urls:
            # Remove existing file
            try:
                os.remove(item['label'])
            except OSError:
                pass
    
    # ===================================================================================================================
    def convertDataToCOG(self, id, fileList):
        try:
            COGFileList = []
            
            cur_download_loc = self.download_loc + '/' + id
            for filePath in fileList:
                ncfile = xr.open_dataset(cur_download_loc + '/' + filePath)
            
                for vname in ncfile.data_vars:
                    # Read file
                    pr = ncfile[vname]

                    if(vname == 'time_bnds'):
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
                    fileNameToStore = self.generateFileName(ncfile.attrs['ShortName'],dateStr,vname) + '.tif'
                    COGFileList.append(fileNameToStore)

                    # AWS S3 path
                    # s3_path = 's3://your_data_path/zarr_example' 
                    # Initilize the S3 file system
                    # s3 = s3fs.S3FileSystem()
                    # store = s3fs.S3Map(root=s3_path, s3=s3, check=False)

                    try:
                        pr.rio.to_raster(os.getcwd() + '/' + cur_download_loc + '/' + fileNameToStore)
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
            cur_download_loc = self.download_loc + '/' + id
            for filePath in fileList:
                ds = xr.open_dataset(cur_download_loc + '/' + filePath)
                
                compressor = zarr.Blosc(cname='zstd', clevel=3)
                for vname in ds.data_vars:
                    # print(vname)
                    if(vname == 'time_bnds'):
                        continue
                    temp_ds = ds[vname].to_dataset()

                    # Saving the file
                    dateStr = ds.attrs['Filename'].split('.')[2]
                    fileNameToStore = self.generateFileName(ds.ShortName,dateStr,vname)
                    zarrFileList.append(fileNameToStore)

                    # AWS S3 path
                    # s3_path = 's3://your_data_path/zarr_example' 
                    # Initilize the S3 file system
                    # s3 = s3fs.S3FileSystem()
                    # store = s3fs.S3Map(root=s3_path, s3=s3, check=False)

                    try:
                        encoding = {vname: {'compressor': compressor}}
                        temp_ds.to_zarr(store=cur_download_loc + '/' + fileNameToStore, encoding=encoding, consolidated=True)
                        # zarrFileList.append(fileNameToStore)
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
            if(not fileNameList):
                print("No filenames present")
                return
            
            cur_download_loc = self.download_loc + '/' + id
            if(format == 'COG'):
                cog_ds = xr.open_rasterio(cur_download_loc + '/' + fileNameList[0])
                lons = cog_ds['x']
                lats = cog_ds['y']
                T2M = cog_ds.values

                for index in range(1,len(cur_download_loc + '/' + fileNameList)):
                    temp_ds = xr.open_rasterio(fileNameList[index])
                    temp_T2M = temp_ds.values
                    T2M = np.vstack((T2M,temp_T2M))
            else:
                zarr_ds = xr.open_zarr(store=cur_download_loc + '/' + fileNameList[0], consolidated=True)
                lons = zarr_ds[varName]['lon'][:]
                lats = zarr_ds[varName]['lat'][:]
                T2M = zarr_ds[varName][:, :, :]

                left,bottom,right,top = zarr_ds.rio.bounds()

                for index in range(1,len(fileNameList)):
                    temp_ds = xr.open_zarr(store=cur_download_loc + '/' + fileNameList[index], consolidated=True)
                    temp_T2M = temp_ds[varName][:, :, :]
                    T2M = np.vstack((T2M,temp_T2M))

            # Take mean of all days data
            T2M = np.mean(T2M,axis=0)

            fig = plt.figure(figsize=(18,12))
            ax = plt.axes(projection=ccrs.PlateCarree())
            ax.set_global()
            ax.coastlines(resolution="110m",linewidth=1)
            ax.gridlines(draw_labels=True,linestyle='--',color='black')

            # Set contour levels, then draw the plot and a colorbar
            clevs = np.arange(215,315,5)
            
            if(T2M.ndim == 3):
                cont=plt.contourf(lons, lats, T2M[0], clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
            else:
                cont=plt.contourf(lons, lats, T2M, clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
            
            plt.title(f'MERRA-2 - {varName}', size=14)
            cb = plt.colorbar(ax=ax, orientation="vertical", pad=0.02, aspect=24, shrink=0.55)
            cb.set_label('K',size=12,rotation=0,labelpad=15)
            cb.ax.tick_params(labelsize=10)

            # AWS S3 UPLOAD
            plt.savefig(f'{cur_download_loc}/image.{varName}.{int(time.time())}.png')
        except Exception as e:
            errorMessage = 'error while image plotting: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
    def visualizeMerra2GIF(self, id, fileNameList, varName, format):
        try:
            cur_download_loc = self.download_loc + '/' + id

            def animate(i,varToShow,lons,lats,clevs,varName):
                if(varToShow.ndim == 4):
                    cont=plt.contourf(lons, lats, varToShow[0][0], clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
                elif(varToShow.ndim == 3):
                    cont=plt.contourf(lons, lats, varToShow[0], clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
                else:
                    cont=plt.contourf(lons, lats, varToShow, clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
                
                if(varToShow.ndim == 4):
                    varToShow = varToShow[i]
                for c in cont.collections:
                    c.remove()  # removes only the contours, leaves the rest intact
                cont = plt.contourf(lons, lats, varToShow[i], clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
                plt.title(f'MERRA-2 - {varName} T: {i+1}')
                return cont

            if(not fileNameList):
                print("No filenames present")
                return
            
            if(format == 'COG'):
                cog_ds = xr.open_rasterio(cur_download_loc + '/' + fileNameList[0])
                lons = cog_ds['x']
                lats = cog_ds['y']
                T2M = cog_ds.values

                for index in range(1,len(fileNameList)):
                    temp_ds = xr.open_rasterio(cur_download_loc + '/' + fileNameList[index])
                    temp_T2M = temp_ds.values
                    T2M = np.vstack((T2M,temp_T2M))
            else:
                zarr_ds = xr.open_zarr(store=cur_download_loc + '/' + fileNameList[0], consolidated=True)
                lons = zarr_ds[varName]['lon'][:]
                lats = zarr_ds[varName]['lat'][:]
                T2M = zarr_ds[varName][:, :, :]

                for index in range(1,len(fileNameList)):
                    temp_ds = xr.open_zarr(store=cur_download_loc + '/' + fileNameList[index], consolidated=True)
                    temp_T2M = temp_ds[varName][:, :, :]      
                    T2M = np.vstack((T2M,temp_T2M))

            # Set the figure size, projection, and extent
            Nt=len(T2M)
            fig = plt.figure(figsize=(18,12))
            ax = plt.axes(projection=ccrs.PlateCarree())
            ax.set_global()
            ax.coastlines(resolution="110m",linewidth=1)
            ax.gridlines(linestyle='--',color='black')

            # Set contour levels, then draw the plot and a colorbar
            clevs = np.arange(215,315,5)
            if(T2M.ndim == 4):
                cont=plt.contourf(lons, lats, T2M[0][0], clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
            elif(T2M.ndim == 3):
                cont=plt.contourf(lons, lats, T2M[0], clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
            else:
                cont=plt.contourf(lons, lats, T2M, clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)

            plt.title(f'MERRA-2 - {varName}', size=14)
            cb = plt.colorbar(ax=ax, orientation="vertical", pad=0.02, aspect=24, shrink=0.55)
            cb.set_label('K',size=12,rotation=0,labelpad=15)
            cb.ax.tick_params(labelsize=10) 
            anim = animation.FuncAnimation(fig, func=partial(animate,varToShow=T2M,lons=lons,lats=lats,clevs=clevs,varName=varName), frames=Nt, interval=500, repeat=True, blit=False)

            # Save as GIF
            anim.save(f'{cur_download_loc}/animation.{varName}.{int(time.time())}.gif', writer='pillow')
        except Exception as e:
            errorMessage = 'error while gif plotting: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
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

    # ===================================================================================================================
    def isFilesPresentInCache(self, id, product, startDate, endDate, varNames, format):
        try:
            present = []

            shortName = product.split('_')[0]

            sd = [int(x) for x in startDate.split("-")]
            ed = [int(x) for x in endDate.split("-")]
            start_date = date(sd[0], sd[1], sd[2]) 
            end_date = date(ed[0], ed[1], ed[2])

            delta = end_date - start_date   # returns timedelta

            newRequestParams = []
            for vname in varNames:
                temp = []
                for i in range(delta.days + 1):
                    day = start_date + timedelta(days=i)
                    dateStr = day.strftime('%Y%m%d')

                    searchString = self.generateFileName(shortName,dateStr,vname)
                    if(format == 'COG'):
                        searchString = searchString + '.tif'
                    print(searchString)
                    cur_download_loc = self.download_loc + '/' + id
                    if os.path.exists(cur_download_loc):
                        file_exists = exists(cur_download_loc + '/' + searchString)
                        print(file_exists)
                        if(file_exists):
                            present.append(searchString)
                            if(len(temp) != 0):
                                subsetStartDate = self.createDateFromFileName(temp[0])
                                subsetEndDate = self.createDateFromFileName(temp[-1])
                                newRequestParams.append({
                                    'startDate': subsetStartDate,
                                    "endDate": subsetEndDate,
                                    "vname": [vname]
                                })
                                temp = []
                        else:
                            temp.append(searchString)

            if(len(present) == 0 and len(newRequestParams) == 0):
                newRequestParams.append({
                    'startDate': startDate,
                    "endDate": endDate,
                    "vname": varNames
                })
            elif(len(temp) != 0):
                subsetStartDate = self.createDateFromFileName(temp[0])
                subsetEndDate = self.createDateFromFileName(temp[-1])
                newRequestParams.append({
                    'startDate': subsetStartDate,
                    "endDate": subsetEndDate,
                    "vname": [vname]
                })

            print("amol",newRequestParams)
            return present,newRequestParams
        except Exception as e:
            errorMessage = 'error while checking local data: {}'.format(e)
            log.error(errorMessage)
            raise Exception(errorMessage)

    # ===================================================================================================================
