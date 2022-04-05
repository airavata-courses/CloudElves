#!/usr/bin/env python
import os, sys
sys.path.insert(0, os.path.abspath(".."))

from producer.publisher import Publisher

if __name__ == "__main__":
    n = 3
    obj = [Publisher() for _ in range(n)]
    data = [{
                "data": {
                    "product": "M2I3NPASM_V5.12.4",
                    "startDate": "2022-02-01",
                    "endDate": "2022-02-02",
                    "varNames": ["T"],
                    "outputType": "image",
                    "userId": "asangar"
                },
                "specVersion": "1.0",
                "type": "elves.ingestor.getdata",
                "source": "gateway",
                "subject": "",
                "id": "68ec6ff3-de38-487c-97b2-4e38534e8ac2",
                "time": "1646305221059",
                "datacontenttype": "application/json"
            },{
                "data": {
                    "product": "M2T1NXSLV_5.12.4",
                    "startDate": "2022-02-04",
                    "endDate": "2022-02-08",
                    "varNames": ["T2M"],
                    "outputType": "image",
                    "userId": "asangar"
                },
                "specVersion": "1.0",
                "type": "elves.ingestor.getdata",
                "source": "gateway",
                "subject": "",
                "id": "68ec6ff3-de38-487c-97b2-4e38534e8ab23",
                "time": "1646305201124",
                "datacontenttype": "application/json"
            },
            {
                "data": {
                    "product": "M2I3NPASM_V5.12.4",
                    "startDate": "2022-02-10",
                    "endDate": "2022-02-12",
                    "varNames": ["T"],
                    "outputType": "image",
                    "userId": "asangar"
                },
                "specVersion": "1.0",
                "type": "elves.ingestor.getdata",
                "source": "gateway",
                "subject": "",
                "id": "68ec6ff3-de38-487c-97b2-4e38534e8bc2",
                "time": "1646305201065",
                "datacontenttype": "application/json"
            }]
    for i in range(n):
        obj[i].publish(queue= "elves.ingestor.merra.in", body = data[i])