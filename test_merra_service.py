import shutil
from unittest import TestCase
import os
import threading
from services.merra_services import MerraService

class TestMerraService(TestCase):
    def __init__(self) -> None:
        super().__init__()
        self.data = {
            "product": "M2T1NXSLV_5.12.4",
            "startDate": "2022-01-01",
            "endDate": "2022-01-02",
            "varNames": ["T2M"],
            "outputType": "gif",
            "userId": "asangar"
        }
        self.id = "test_id"
        os.environ["merra_download_loc"] = "pytest_merra"
        os.environ["l1_cache_loc"] = "pytest_cache"
        self.l1CacheMutex = threading.Lock()
        self.plotMutex = threading.Lock()
        self.merraService = MerraService(self.l1CacheMutex,self.plotMutex)

    def test_CompleteFlowZarrFormat_Positive(self):        
        self.id = self.id + '1'
        fileList, convertedFiles, outputFiles = self.merraService.startMerraService(self.id,self.data)
        cache_loc = os.getenv('l1_cache_loc')
        image_loc = os.getenv('merra_download_loc')
                
        cur_download_loc = os.getenv('merra_download_loc') + '/' + self.id
        if os.path.exists(cur_download_loc):
          fileListToCheck = []
          convertedFilesToCheck = [f'{cache_loc}/MERRA2.M2T1NXSLV.20220101.T2M', f'{cache_loc}/MERRA2.M2T1NXSLV.20220102.T2M']
          imageFileNameToCheck = f'{image_loc}/test_id1/animation.T2M.'

          self.assertEqual(fileListToCheck, fileList)
          self.assertEqual(convertedFilesToCheck, convertedFiles)
          self.assertIn(imageFileNameToCheck, outputFiles)
        
        # try:
        #   shutil.rmtree(os.getenv('merra_download_loc'))
        #   shutil.rmtree(os.getenv('l1_cache_loc'))
        # except:
        #   pass
    
    def test_CompleteFlowCOGFormat_Positive(self):        
        self.id = self.id + '2'
        fileList, convertedFiles, outputFiles = self.merraService.startMerraService(self.id,self.data)
        cache_loc = os.getenv('l1_cache_loc')
        image_loc = os.getenv('merra_download_loc')

        cur_download_loc = os.getenv('merra_download_loc') + '/' + self.id
        if os.path.exists(cur_download_loc):
          fileListToCheck = []
          convertedFilesToCheck = [f'{cache_loc}/MERRA2.M2T1NXSLV.20220101.T2M.tif', f'{cache_loc}/MERRA2.M2T1NXSLV.20220102.T2M.tif']
          imageFileNameToCheck = f'{image_loc}/test_id2/animation.T2M.'

          self.assertEqual(fileListToCheck, fileList)
          self.assertEqual(convertedFilesToCheck, convertedFiles)
          self.assertIn(imageFileNameToCheck, outputFiles)
        
        # try:
        #   shutil.rmtree(os.getenv('merra_download_loc'))
        #   shutil.rmtree(os.getenv('l1_cache_loc'))
        # except:
        #   pass

if __name__ == '__main__':
    os.environ["data_conversion_format"] = "zarr"
    merra_test1 = TestMerraService()
    merra_test1.test_CompleteFlowZarrFormat_Positive()
    os.environ.pop('data_conversion_format', None)

    os.environ["data_conversion_format"] = "COG"
    merra_test2 = TestMerraService()
    merra_test2.test_CompleteFlowCOGFormat_Positive()
    os.environ.pop('data_conversion_format', None)

    os.environ.pop('merra_download_loc', None)
    os.environ.pop('l1_cache_loc', None)
