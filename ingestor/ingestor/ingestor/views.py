import tempfile

from django.shortcuts import render

from django.http import HttpResponse
import datetime
import matplotlib.pyplot as plt
import requests
from django.shortcuts import render

import pytz
from datetime import datetime
import pyart
import nexradaws
from . import services


##JJ Helmus and SM Collis, JORS 2016, doi: 10.5334/jors.119
##JJ Helmus and SM Collis, JORS 2016, doi: 10.5334/jors.119


# templocation = tempfile.mkdtemp()
#
#
# def ingest(request):
#     conn = nexradaws.NexradAwsInterface()
#     years = conn.get_avail_years()
#     useryear = request.GET['years']
#
#     # print(years)
#     months = conn.get_avail_months('2013')
#     # print(months)
#     days = conn.get_avail_days('2013', '05')
#     # print(days)
#     radars = conn.get_avail_radars('2013', '05', '31')
#     # print(radars)
#     availscans = conn.get_avail_scans('2013', '05', '31', 'KTLX')
#     print("There are {} NEXRAD files available for May 31st, 2013 for the KTLX radar.\n".format(len(availscans)))
#     # print(availscans[0:4])
#     central_timezone = pytz.timezone('US/Central')
#     radar_id = 'KTLX'
#     start = central_timezone.localize(datetime(2013, 5, 31, 17, 0))
#     end = central_timezone.localize(datetime(2013, 5, 31, 19, 0))
#     scans = conn.get_avail_scans_in_range(start, end, radar_id)
#     print("There are {} scans available between {} and {}\n".format(len(scans), start, end))
#     print(scans[0:4])
#
#     results = conn.download(scans[0:4], templocation)
#     print(results.success)
#     for scan in results.iter_success():
#         print("{} volume scan time {}".format(scan.radar_id, scan.scan_time))
#
#     print("{} downloads failed.".format(results.failed_count))
#     print(results.failed)
#
#     fig = plt.figure(figsize=(16, 12))
#     for i, scan in enumerate(results.iter_success(), start=1):
#         ax = fig.add_subplot(2, 2, i)
#         radar = scan.open_pyart()
#         display = pyart.graph.RadarDisplay(radar)
#         display.plot('reflectivity', 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
#         display.set_limits((-150, 150), (-150, 150), ax=ax)
#
#
# ingest()

def ingest(request):
    keys = ['year', 'month', 'day', 'radar']
    for key in keys:
        if key not in request.GET:
            return HttpResponse("Bad request: {} not available".format(key))
    try:
        services.validate_input(request.GET['year'], request.GET['month'], request.GET['day'], request.GET['radar'])
        print("validated data")
        downloaded_data = services.download_data(int(request.GET['year']), int(request.GET['month']), int(request.GET['day']), int(request.GET['starttime']),
                               int(request.GET['endtime']), request.GET['radar'])
        print("downloaded data")
        services.plot_data(request.GET['id'], downloaded_data)
        print("data plotted")
        return HttpResponse("success")
    # multipart response

    except Exception as e:
        print(e)
        return HttpResponse(e)

def image(request):
    try:
        # services.get_image(request.GET['filename'])
        print("got filename")
        return services.get_image(request.GET['filename'])
    except Exception as e:
        print(e)
        return HttpResponse(e)
