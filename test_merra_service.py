import shutil
from unittest import TestCase
import unittest
import os
from services.merra_services import MerraService

class TestMerraService(TestCase):
    def __init__(self) -> None:
        super().__init__()
        self.data = {
            "product": "M2T1NXSLV_5.12.4",
            "startDate": "2022-01-01",
            "endDate": "2022-01-02",
            "varNames": ["T2M"],
            "outputType": "image",
            "userId": "asangar"
        }
        self.id = "test_id"
        os.environ["merra_download_loc"] = "pytest_merra"
        self.merraService = MerraService()

    def test_CompleteFlowZarrFormat_Positive(self):        
        self.id = self.id + '1'
        fileList, convertedFiles, outputFiles = self.merraService.startMerraService(self.id,self.data)
        
        cur_download_loc = os.getenv('merra_download_loc') + '/' + self.id
        if os.path.exists(cur_download_loc):
          fileListToCheck = []
          convertedFilesToCheck = ['./local_cache/MERRA2.M2T1NXSLV.20220101.T2M', './local_cache/MERRA2.M2T1NXSLV.20220102.T2M']
          imageFileNameToCheck = 'pytest_merra/test_id1/image.T2M.'

          self.assertEqual(fileListToCheck, fileList)
          self.assertEqual(convertedFilesToCheck, convertedFiles)
          self.assertIn(imageFileNameToCheck[0], outputFiles)
        
        try:
          shutil.rmtree(os.getenv('merra_download_loc'))
        except:
          pass
    
    def test_CompleteFlowCOGFormat_Positive(self):        
        self.id = self.id + '2'
        fileList, convertedFiles, outputFiles = self.merraService.startMerraService(self.id,self.data)
        
        cur_download_loc = os.getenv('merra_download_loc') + '/' + self.id
        if os.path.exists(cur_download_loc):
          fileListToCheck = []
          convertedFilesToCheck = ['./local_cache/MERRA2.M2T1NXSLV.20220101.T2M.tif', './local_cache/MERRA2.M2T1NXSLV.20220102.T2M.tif']
          imageFileNameToCheck = 'pytest_merra/test_id2/image.T2M.'

          self.assertEqual(fileListToCheck, fileList)
          self.assertEqual(convertedFilesToCheck, convertedFiles)
          self.assertIn(imageFileNameToCheck, outputFiles)
        
        try:
          shutil.rmtree(os.getenv('merra_download_loc'))
        except:
          pass

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