import random

import simplekml
from django.http import HttpResponse

kml = simplekml.Kml()


def stormclustering():
    storm = True if random.randint(0,100) % 2 == 0 else False
    return storm


