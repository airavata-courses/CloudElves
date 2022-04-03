#!/usr/bin/env python

from producer.publisher import Publisher

if __name__ == "__main__":
    n = 2
    obj = [Publisher() for _ in range(n)]
    data = [{
                "data": {
                    "product": "M2I3NPASM_V5.12.4",
                    "startDate": "2022-01-01",
                    "endDate": "2022-01-02",
                    "varNames": ["T"],
                    "outputType": "gif",
                    "userId": "asangar"
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
                    "product": "M2T1NXSLV_5.12.4",
                    "startDate": "2022-01-04",
                    "endDate": "2022-01-08",
                    "varNames": ["T2M"],
                    "outputType": "image",
                    "userId": "asangar"
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
        obj[i].publish(queue= "elves.ingestor.merra.in", exchange="elvesExchange", body = data[i])