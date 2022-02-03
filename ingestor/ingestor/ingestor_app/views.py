
from django.http import HttpResponse, JsonResponse
from rest_framework import status

from . import services
import os
from .services import download_loc
import shutil



def ingest(request):
    keys = ['year', 'month', 'day', 'radar']
    for key in keys:
        if key not in request.GET:
            return JsonResponse({'error': 'Bad request: {} not available'.format(key)}, status=status.HTTP_400_BAD_REQUEST)
    try:
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
        return JsonResponse({'error':  str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def image(request):
    try:
        # services.get_image(request.GET['filename'])
        print(request.GET['filename'])
        return services.get_image(request.GET['filename'])
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
