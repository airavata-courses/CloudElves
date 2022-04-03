#!/usr/bin/env python

from producer.publisher import Publisher

if __name__ == "__main__":
    n = 1
    obj = [Publisher() for _ in range(n)]
    data = [{
        "data":            {
            "year":      "2013",
            "month":     "05",
            "day":       "31",
            "startTime": "123",
            "endTime":   "124",
            "userId":    "madhkr",
            "radar":     "KTLX",
            "plotType":  'velocity'
            },
        "specVersion":     "1.0",
        "type":            "elves.ingestor.getdata",
        "source":          "gateway",
        "subject":         "",
        "id":              "68ec6ff3-de38-487c-97b2-4e38534e8ab0",
        "time":            "1646305201059",
        "datacontenttype": "application/json"
        }, {
        "data":            {
            "year":      "2018",
            "month":     "02",
            "day":       "02",
            "startTime": "123",
            "endTime":   "124",
            "userId":    "madhkr",
            "radar":     "KABR",
            "plotType":  'reflectivity'
            },
        "specVersion":     "1.0",
        "type":            "elves.ingestor.getdata",
        "source":          "gateway",
        "subject":         "",
        "id":              "abec6ff3-de38-487c-97b2-4e38534e8ab0",
        "time":            "1646305201059",
        "datacontenttype": "application/json"
        }]
    for i in range(1):
        obj[0].publish(queue="elves.ingestor.data.in", body=data[i])
