import random

from django.http import HttpResponse, JsonResponse
from rest_framework import status

from . import services1

weather_description = ['clear', 'rainy', 'thunderstorms', 'snow']


def stormclustering_controller(request):
    try:
        return JsonResponse({'storm_detected': services1.stormclustering()})
    except Exception as e:
        print(e)
        return JsonResponse({'error': e.value})


def forecast_controller(request):
    minimum = random.randint(1, 60)
    maximum = random.randint(90, 130)
    weather_desc_index = minimum % 4
    response = {'min_temp': minimum, 'max_temp': maximum, 'pressure': minimum % 10,
                'humidity': maximum % 10 * 20, 'weather_description': weather_description[weather_desc_index]}
    return JsonResponse(response)


def health(request):
    try:
        return JsonResponse({'Health': "OK"})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
