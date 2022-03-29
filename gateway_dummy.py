#!/usr/bin/env python

from publisher import Publisher

if __name__ == "__main__":
    n = 2
    obj = [Publisher() for _ in range(n)]
    data = [{
                "data": {
                    "year": "2018",
                    "month": "02",
                    "day": "02",
                    "startTime": "123",
                    "endTime": "124",
                    "userId": "madhkr",
                    "radar": "KABR"
                },
                "specVersion": "1.0",
                "type": "elves.ingestor.getdata",
                "source": "gateway",
                "subject": "",
                "id": "68ec6ff3-de38-487c-97b2-4e38534e8ab0",
                "time": "1646305201059",
                "datacontenttype": "application/json"
            },{
                "data": {
                    "year": "2019",
                    "month": "01",
                    "day": "02",
                    "startTime": "123",
                    "endTime": "124",
                    "userId": "madhkr",
                    "radar": "KABR"
                },
                "specVersion": "1.0",
                "type": "elves.ingestor.getdata",
                "source": "gateway",
                "subject": "",
                "id": "68ec6ff3-de38-487c-97b2-4e38534e8ab00",
                "time": "1646305201059",
                "datacontenttype": "application/json"
            }]
    for i in range(n):
        obj[i].publish(queue= "elves.ingestor.data.in", exchange="elvesExchange", body = data[i])