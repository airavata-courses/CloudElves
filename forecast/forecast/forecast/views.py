import random

from django.http import HttpResponse, JsonResponse

from . import services1


def stormclustering_controller(request):
    try:
        return JsonResponse({'storm_detected': services1.stormclustering()})
    except Exception as e:
        print(e)
        return JsonResponse({'error': e.value})


def forecast_controller(request):
    minimum = random.randint(1, 60)
    maximum = random.randint(90, 130)
    response = {'weather data': {'min_temp': minimum, 'max_temp': maximum, 'pressure': minimum % 10,
                                 'humidity': maximum % 10 * 20}}
    return JsonResponse(response)
