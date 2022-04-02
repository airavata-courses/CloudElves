# import tempfile
# import shutil
# from unittest import TestCase
# import nexradaws
# from nexradaws.resources.localnexradfile import LocalNexradFile
# from nexradaws.resources.awsnexradfile import AwsNexradFile
# from services.services import Services
# from commons.constants import Constants
# 
# class TestIngestorService(TestCase):
# 
#    # Tests the validity of input parameters
#     def testParameters(self):
#         self.test_input =  {
#                     "year": '2022',
#                     "month": '02',
#                     "day": '02',
#                     "startTime": "1643807400279",
#                     "endTime": "1643807400279",
#                     "radar": "KAKQ",
#                     "userId": "madhkr"
#             }
#         self.assertEqual(self.test_input.keys(), {'year', 'month', 'day', 'radar', 'userId', 'startTime', 'endTime'})
#  
#     def setUp(self):
#         self.query = nexradaws.NexradAwsInterface()
#         self.templocation = tempfile.mkdtemp()
#         self.service_obj = Services()
#         self.test_input = Constants().dummy_input
#         # start = datetime(1643807400279)
#         # end = datetime(2013, 5, 20, 19, 00)
#         self.scans = self.query.get_avail_scans(self.test_input['data']["year"], self.test_input['data']["month"], self.test_input['data']["day"], self.test_input['data']["radar"])[:4]
# 
#     def tearDown(self):
#         shutil.rmtree(self.templocation)
# 
#     def testParameters(self):
#         self.assertEqual(self.service_obj.isValid(self.test_input['data'])[0], True)
# 
#     def testDownload(self):
#         self.results = self.service_obj.getData(self.test_input['data'], self.test_input['id'])
#         self.assertEqual(self.results[0], True)
#     
#     def testPlot(self):
#         self.assertEqual(self.service_obj.plotImage(self.results[1],self.test_input['id'])[0], True)
#     
# 
# class TestNexradService(TestCase):
# 
#     def setUp(self):
#         self.query = nexradaws.NexradAwsInterface()
#         self.templocation = tempfile.mkdtemp()
#         # start = datetime(1643807400279)
#         # end = datetime(2013, 5, 20, 19, 00)
#         self.scans = self.query.get_avail_scans(self.test_input["year"], self.test_input["month"], self.test_input["day"], self.test_input["radar"])[:4]
# 
#     def tearDown(self):
#         shutil.rmtree(self.templocation)
# 
#     def test_total(self):
#         results = self.query.download(self.scans,self.templocation)
#         self.assertEqual(len(self.scans),results.total)
# 
#     def test_success_count(self):
#         results = self.query.download(self.scans[:4], self.templocation)
#         self.assertEqual(results.success_count,len(self.scans))
# 
#     def test_failed_count(self):
#         self.scans[0].key = 'blah/blah'
#         results = self.query.download(self.scans, self.templocation)
#         self.assertEqual(results.failed_count,1)
# 
#     def test_success(self):
#         results = self.query.download(self.scans, self.templocation)
#         self.assertIsInstance(results.success,list)
#         self.assertIsInstance(results.success[0],LocalNexradFile)
# 
#     def test_failed(self):
#         # Change the key to the first scan to enduce a download failure
#         self.scans[0].key = 'blah/blah'
#         results = self.query.download(self.scans, self.templocation)
#         self.assertIsInstance(results.failed,list)
# 
#     def test_iter_success(self):
#         results = self.query.download(self.scans, self.templocation)
#         for localfile in results.iter_success():
#             self.assertIsInstance(localfile,LocalNexradFile)
# 
#     def test_iter_failed(self):
#         # Change the key to the first scan to enduce a download failure
#         self.scans[0].key = 'blah/blah'
#         results = self.query.download(self.scans, self.templocation)
#         for errorfile in results.iter_failed():
#             self.assertIsInstance(errorfile, AwsNexradFile)
# 
# 
# if __name__ == '__main__':
#     # Test cases for Nexrad Service
#     # nexrad = TestNexradService()
#     # nexrad.setUp()
#     # nexrad.test_total()
#     # nexrad.test_success()
#     # nexrad.test_failed()
#     # nexrad.test_iter_success()
#     # nexrad.test_iter_failed()
#     # nexrad.tearDown()
# 
#     # Test cases for Ingestor Service
#     ingestor = TestIngestorService()
#     ingestor.setUp()
#     ingestor.testParameters()
#     ingestor.testDownload()
#     ingestor.testPlot()
#     ingestor.tearDown()
import unittest


class mytest(unittest.TestCase):
    def test_one(self):
        x = 'test'
        self.assertIsInstance(x, str)


if __name__ == '__main__':
    unittest.main()
