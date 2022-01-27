from django.http import HttpResponse
import datetime
import matplotlib.pyplot as plt
import tempfile
import pytz
from datetime import datetime
import pyart
import nexradaws

conn = nexradaws.NexradAwsInterface()


##JJ Helmus and SM Collis, JORS 2016, doi: 10.5334/jors.119
##JJ Helmus and SM Collis, JORS 2016, doi: 10.5334/jors.119



def ingest(request):
    years = conn.get_avail_years()
    months = conn.get_avail_months(years[0])
    days = conn.get_avail_months(years[0], months[0])
    radars = conn.get_avail_radars(years[0], months[0], days[0])

    central_timezone = pytz.timezone('US/Central')
    radar_id = 'KTLX'
    start = central_timezone.localize(datetime(2013, 5, 31, 17, 0))
    end = central_timezone.localize(datetime(2013, 5, 31, 19, 0))

    scans = conn.get_avail_scans_in_range(start, end, radar_id)
    results = conn.download(scans[0:4], '/Users/ayush/Desktop/ADS ')

    fig = plt.figure(figsize=(16, 12))
    for i, scan in enumerate(results.iter_success(), start=1):
        ax = fig.add_subplot(2, 2, i)
        radar = scan.open_pyart()
        display = pyart.graph.RadarDisplay(radar)
        display.plot('reflectivity', 0, ax=ax, title="{} {}".format(scan.radar_id, scan.scan_time))
        display.set_limits((-150, 150), (-150, 150), ax=ax)
    return HttpResponse()


