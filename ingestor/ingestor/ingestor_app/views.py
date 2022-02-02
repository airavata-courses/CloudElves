
from django.http import HttpResponse, JsonResponse
from . import services
import os
from .services import templocation
import shutil



def ingest(request):
    keys = ['year', 'month', 'day', 'radar']
    for key in keys:
        if key not in request.GET:
            return HttpResponse("Bad request: {} not available".format(key))
    try:
        if os.listdir(templocation):
            shutil.rmtree(templocation)
        services.validate_input(request.GET['year'], request.GET['month'], request.GET['day'], request.GET['radar'])
        print("validated data")
        downloaded_data = services.download_data(int(request.GET['year']), int(request.GET['month']),
                                                 int(request.GET['day']), int(request.GET['starttime']),
                                                 int(request.GET['endtime']), request.GET['radar'])
        print("downloaded data")
        data = services.plot_data(request.GET['id'], downloaded_data)
        print("data plotted")
        return JsonResponse({"data": data})
    # multipart response

    except Exception as e:
        print(e)
        return HttpResponse(e)


def image(request):
    try:
        # services.get_image(request.GET['filename'])
        print(request.GET['filename'])
        return services.get_image(request.GET['filename'])
        print("got filename")
    except Exception as e:
        print(e)
        return HttpResponse(e)
