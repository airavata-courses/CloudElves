import datetime
import os
import shutil

import nexradaws
import pyart
from matplotlib import pyplot as plt

class Services:

    def __init__(self) -> None:
        self.connection = nexradaws.NexradAwsInterface()

    # performs validation on requested data.
    def isValid(self, data):
        print("---> Start validation")
        try:
            if set(data.keys()) != {'year', 'month', 'day', 'radar', 'userId', 'startTime', 'endTime'}:
                raise Exception("XXX Invalid input fields!")

            years = self.connection.get_avail_years()
            if data["year"] not in years:
                raise Exception("XXX Invalid Year!")

            months = self.connection.get_avail_months(data["year"])
            if data["month"] not in months:
                raise Exception("XXX Invalid Month!")

            days = self.connection.get_avail_days(data["year"], data["month"])
            if data["day"] not in days:
                raise Exception("XXX Invalid Day!")

            radars = self.connection.get_avail_radars(data["year"], data["month"], data["day"])
            if data["radar"] not in radars:
                raise Exception("XXX Invalid Radar!")

            print("---> End validation")
            return (True, "Success")

        except Exception as e:
            print(e)
            return (False, e)

    # downloads data from nexrad
    def getData(self, data, id):
        download_loc = './downloaded_data/'
        try:
            if not os.path.exists(download_loc):
                os.mkdir(download_loc)
                print("dir created")
            else:
                for f in os.listdir(download_loc):
                    shutil.rmtree(download_loc)

            scans = self.connection.get_avail_scans(data["year"], data["month"], data["day"], data["radar"])
            print(scans[0:1])
            result = self.connection.download(scans[:4], download_loc)
            print(result.success)
            for scan in result.iter_success():
                print("{} volume scan time {}".format(scan.radar_id, scan.scan_time))
            if len(result.success) == 0:
                raise Exception("nexrad data download error.")

            return (True, result)

        except Exception as e:
            print(e)
            return (False, e)

    # plots the image out of data retrieved from nexrad.
    def plotImage(self, scans, requested_id):
        image_loc = './plotted_data/'
        if not os.path.exists(image_loc):
            os.mkdir(image_loc)
            print("dir created")
        else:
            for f in os.listdir(image_loc):
                shutil.rmtree(image_loc)
        # return True, "sample image"
        try:
            fig = plt.figure(figsize=(16, 12))
            for i, scan in enumerate(scans.iter_success(), start=1):
                ax = fig.add_subplot(2, 2, i)
                radar = scan.open_pyart()
                display = pyart.graph.RadarDisplay(radar)
                display.plot('reflectivity', 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
                display.set_limits((-150, 150), (-150, 150), ax=ax)

            fig.savefig(requested_id + ".png")
            # pic_IObytes = io.BytesIO()
            # fig.savefig(pic_IObytes, format='png')
            # pic_IObytes.seek(0)
            # pic_hash = base64.b64encode(pic_IObytes.read())
            # # print(pic_hash)
            print("figure plotted")
            return (True,  '')
        except Exception as e:
            print(e)
            return (False, e)

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
