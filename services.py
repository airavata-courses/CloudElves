import base64
import datetime
import io
import os
from urllib import request
import matplotlib
import nexradaws

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from metpy.plots import add_metpy_logo, add_timestamp
import numpy as np


class Services:
    download_loc = './downloaded_data/'
    image_loc = './plotted_data/'

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

    # downloads data from nexrad.
    def getData(self, data, id):

        download_loc = os.getenv('download_path') or './downloaded_data/'
        image_loc = './plotted_data/'

        try:
            if not os.path.exists(image_loc):
                os.mkdir(image_loc)
                print("dir created")

                # print('Check for directory:', dir)
                # if not os.path.exists(dir):
                #     print("exists")
                #     for files in os.listdir(dir):
                #         path = os.path.join(dir, files)
                #         try:
                #             shutil.rmtree(path)
                #         except OSError:
                #             os.remove(path)
                # else:
                #     print("directory does not exist")
                #     os.mkdir(dir)
                #     print("dir created")
                
                
            scans = self.connection.get_avail_scans(data["year"], data["month"], data["day"], data["radar"])
            print(len(scans))
            print(scans[0:1])
            result = self.connection.download(scans[:2], image_loc)
            # print(result.success)
            # for scan in result.iter_success():
            #     print("{} volume scan time {}".format(scan.radar_id, scan.scan_time))
            if len(result.success) == 0:
                raise Exception("nexrad data download error.")

            return (True, result)

        except Exception as e:
            print(e)
            return (False, e)

    # plots the image out of data retrieved from nexrad.
    def getImage(self, request_id, f):
        
        try:
            sweep = 0
            az = np.array([ray[0].az_angle for ray in f.sweeps[sweep]])
            diff = np.diff(az)
            diff[diff > 180] -= 360.
            diff[diff < -180] += 360.
            avg_spacing = diff.mean()
            az = (az[:-1] + az[1:]) / 2
            az = np.concatenate(([az[0] - avg_spacing], az, [az[-1] + avg_spacing]))

            ref_hdr = f.sweeps[sweep][0][4][b'REF'][0]
            ref_range = (np.arange(
                ref_hdr.num_gates + 1) - 0.5) * ref_hdr.gate_width + ref_hdr.first_gate
            ref = np.array([ray[4][b'REF'][1] for ray in f.sweeps[sweep]])

            rho_hdr = f.sweeps[sweep][0][4][b'RHO'][0]
            rho_range = (np.arange(
                rho_hdr.num_gates + 1) - 0.5) * rho_hdr.gate_width + rho_hdr.first_gate
            rho = np.array([ray[4][b'RHO'][1] for ray in f.sweeps[sweep]])

            fig, axes = plt.subplots(1, 2, figsize=(15, 8))
            add_metpy_logo(fig, 190, 85, size='large')
            for var_data, var_range, ax in zip((ref, rho), (ref_range, rho_range),
                                               axes):
                # Turn into an array, then mask
                data = np.ma.array(var_data)
                data[np.isnan(data)] = np.ma.masked

                # Convert az,range to x,y
                xlocs = var_range * np.sin(np.deg2rad(az[:, np.newaxis]))
                ylocs = var_range * np.cos(np.deg2rad(az[:, np.newaxis]))

                # Plot the data
                ax.pcolormesh(xlocs, ylocs, data, cmap='viridis')
                ax.set_aspect('equal', 'datalim')
                ax.set_xlim(-40, 20)
                ax.set_ylim(-30, 30)
                add_timestamp(ax, f.dt, y=0.02, high_contrast=True)
            plt.savefig(f'{request_id}.png')
            # fig = plt.figure(figsize=(16, 12))
            # for i, scan in enumerate(scans.iter_success(), start=1):
            #     ax = fig.add_subplot(2, 2, i)
            #     radar = scan.open_pyart()
            #     display = pyart.graph.RadarDisplay(radar)
            #     display.plot('reflectivity', 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
            #     display.set_limits((-150, 150), (-150, 150), ax=ax)
            #
            # fig.savefig(image_loc + requested_id + ".png")
            # print("figure plotted")
            # return requested_id + ".png"

            # Convert figure to base64
            # pic_IObytes = io.BytesIO()
            # plt.savefig(pic_IObytes, format='png')
            # pic_IObytes.seek(0)
            # pic_hash = base64.b64encode(pic_IObytes.read())
            # return (True, pic_hash)
            return (True, "aaa")
        except Exception as e:
            print(type(e))
            return (False, e)
        # finally:
        #     # dir = os.getenv('download_path') or './radar_data/' + id
        #     dir = os.getenv('download_path') or './radar_data'
        #     dir = dir + '/' + id
        #     if os.path.exists(dir):
        #         shutil.rmtree(dir)
        #     print("deletd dir:", dir)

    # returns data formatted as a dictionary.
    def generatePayload(self, action="elves.ingetor.getdata", comments="500: Internal Server Error", encoded_image="",
                        event_type="elves.registry.applog.in", id="", source="ingestor", specversion="1.0", status="2",
                        subject="", user="", datacontenttype="application/json"):
        return {
            "specversion": specversion,
            "type": event_type,
            "source": source,
            "subject": subject,
            "id": id,
            "time": str(datetime.datetime.now()),
            "datacontenttype": datacontenttype,
            "data": {
                "action": action,
                "id": id,
                "userId": user,
                "image": encoded_image,
                "comments": comments,
                "status": status
            }
        }
