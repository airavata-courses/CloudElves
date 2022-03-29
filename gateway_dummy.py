#!/usr/bin/env python

from publisher import Publisher

if __name__ == "__main__":
    obj = [Publisher() for _ in range(20)]
    data = {
                "data": {
                    "year": "2020",
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
            }
    for i in range(20):
        obj[i].publish(queue= "elves.ingestor.data.in", exchange="elvesExchange", body = data)