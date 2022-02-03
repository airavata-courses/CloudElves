import os
import shutil
from logging import exception
import pytz
import pyart
import nexradaws
from django.http import HttpResponse
from matplotlib import pyplot as plt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

conn = nexradaws.NexradAwsInterface()
download_loc = './downloaded_data/'
image_loc = './plotted_data/'

if not os.path.exists(image_loc):
    os.mkdir(image_loc)

def validate_input(requested_year, requested_month, requested_day, requested_radar):
    print("Starting Validation")

    years = conn.get_avail_years()
    if requested_year not in years:
        raise Exception("Invalid year requested")
    print("Validated year")

    months = conn.get_avail_months(requested_year)
    if requested_month not in months:
        raise Exception("Invalid month requested")
    print("Validated Month")

    days = conn.get_avail_days(requested_year, requested_month)
    if requested_day not in days:
        raise Exception("Invalid day requested")
    print("Validated days")

    radars = conn.get_avail_radars(requested_year, requested_month, requested_day)
    if requested_radar not in radars:
        raise Exception("Invalid radar requested")
    print("Validated radars")

    # print("Validated User input")
    return True


def download_data(requested_year, requested_month, requested_day, requested_starttime, requested_endtime,
                  requested_radar):
    if os.path.exists(download_loc):
        shutil.rmtree(download_loc)
    os.mkdir(download_loc)
    central_timezone = pytz.timezone('US/Central')
    radar_id = requested_radar
    # start = central_timezone.localize(datetime(requested_year, requested_month, requested_day, requested_starttime, requested_endtime))
    # end = central_timezone.localize(datetime(requested_year, requested_month, requested_day, requested_starttime, requested_endtime))
    # scans = conn.get_avail_scans_in_range(start, end, radar_id)
    scans = conn.get_avail_scans(requested_year, requested_month, requested_day, requested_radar)
    # print("There are {} scans available between {} and {}\n".format(len(scans), start, end))
    print(scans[0:4])
    results = conn.download(scans[0:4], download_loc)
    print(results.success)
    for scan in results.iter_success():
        print("{} volume scan time {}".format(scan.radar_id, scan.scan_time))
    if len(results.success) == 0:
        raise exception("Downloads failed")

    return results


def plot_data(requested_id, results):
    # plotting storms
    try:
        fig = plt.figure(figsize=(16, 12))
        for i, scan in enumerate(results.iter_success(), start=1):
            ax = fig.add_subplot(2, 2, i)
            radar = scan.open_pyart()
            display = pyart.graph.RadarDisplay(radar)
            display.plot('reflectivity', 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
            display.set_limits((-150, 150), (-150, 150), ax=ax)

        fig.savefig(image_loc + requested_id + ".png")
        return requested_id + ".png"
    except:
        return "default.png"


# create an api, that when a fig.png is requested by madhavan; return a file; returning a file as an api response in django

@renderer_classes([JSONRenderer])
def get_image(filename):
    file_path = image_loc+filename
    FilePointer = open(file_path, "rb")
    print("got file")
    response = HttpResponse(FilePointer, content_type='image/png')
    response['Content-Disposition'] = 'attachment; filename=NameOfFile'

    return response

