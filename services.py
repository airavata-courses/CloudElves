# import numpy as np
import nexradaws
import os, shutil
import datetime
# from matplotlib import pyplot as plt

class Services:

    def __init__(self) -> None:
        self.__connection = nexradaws.NexradAwsInterface()

    # performs validation on requested data.
    def isValid(self,data):
        print("---> Start validation")
        try:
            if set(data.keys()) != {'year', 'month', 'day', 'radar', 'userId', 'startTime', 'endTime'}:
                raise Exception("XXX Invalid input fields!")

            years = self.__connection.get_avail_years()
            if data["year"] not in years:
                raise Exception("XXX Invalid Year!")
            
            months = self.__connection.get_avail_months(data["year"])
            if data["month"] not in months:
                raise Exception("XXX Invalid Month!")
            
            days = self.__connection.get_avail_days(data["year"], data["month"])
            if data["day"] not in days:
                raise Exception("XXX Invalid Day!")
            
            radars = self.__connection.get_avail_radars(data["year"], data["month"], data["day"])
            if data["radar"] not in radars:
                raise Exception("XXX Invalid Radar!")

            print("---> End validation")
            return (True,1)

        except Exception as e:
            print(e)
            return (False,e)

    # downloads data from nexrad.
    def getData(self,data):
        try:
            dir = os.getenv('download_path') or './radar_data/'
            if os.path.exists(dir):
                print("does")
                for files in os.listdir(dir):
                    path = os.path.join(dir, files)
                    try:
                        shutil.rmtree(path)
                    except OSError:
                        os.remove(path)
            else:
                print("does not")
                os.mkdir(dir)
            
            scans = self.__connection.get_avail_scans(data["year"], data["month"], data["day"], data["radar"])
            # print(len(scans))
            print(scans[0:2])
            result = self.__connection.download(scans[:2], dir)
            # print(result.success)
            # for scan in result.iter_success():
            #     print("{} volume scan time {}".format(scan.radar_id, scan.scan_time))
            if len(result.success) == 0:
                raise Exception("nexrad data download error.")
            return (True,result)
        except Exception as e:
            print(e)
            return (False,e)

    # plots the image out of data retrieved from nexrad.
    def plotImage(self,scans):
        pass
        try:
        #     fig = plt.figure(figsize=(16, 12))
        #     for i, scan in enumerate(scans.iter_success(), start=1):
        #         ax = fig.add_subplot(2, 2, i)
        #         radar = scan.open_pyart()
        #         display = pyart.graph.RadarDisplay(radar)
        #         display.plot('reflectivity', 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
        #         display.set_limits((-150, 150), (-150, 150), ax=ax)

        #     fig.savefig(image_loc + requested_id + ".png")
        #     return requested_id + ".png"
            return (True,"image-name.png")
        except Exception as e:
            print(type(e))
            return (False,e)

    # returns data formatted as a dictionary.
    def generatePayload(self,action = "elves.ingetor.getdata",comments = "500: Internal Server Error", encoded_image="", event_type="elves.registry.applog.in", id="", source="ingestor", specversion="1.0", status="2",subject="", user="",datacontenttype="application/json"):
        return {
            "specversion" : specversion,
            "type" :event_type,
            "source" : source,
            "subject": subject,
            "id" : id,
            "time" : str(datetime.datetime.now()),
            "datacontenttype" : datacontenttype,
            "data" : {
                "action": action,
                "id":  id,
                "userId":user,
                "image": encoded_image,
                "comments": comments,
                "status": status
            }
        }