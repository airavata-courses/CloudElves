from services import Services
from publisher import Publisher

class Processor:
    def __init__(self,payload) -> None:
        self.__payload = payload
        self.__serviceObj = Services()
        self.__isValid = self.__serviceObj.isValid(self.__payload["data"])
        self.__publisherObj = Publisher()
        """
            {
                "data": {
                    "year": 2022,
                    "month": 2,
                    "day": 2,
                    "startTime": "1643807400279",
                    "endTime": "1643807400279",
                    "radarStation": "KAKQ",
                    "userId": "madhkr"
                },
                "specVersion": null,
                "type": "elves.ingestor.getdata",
                "source": "gateway",
                "subject": null,
                "id": "68ec6ff3-de38-487c-97b2-4e38534e8ab0",
                "time": "1646305201059",
                "datacontenttype": "application/json"
            }
        """
        if self.__isValid[0]:
            self.__getData = self.__serviceObj.getData(self.__payload["data"])
            if self.__getData[0]:
                print("Data downloaded!")
                # plot image out of data recieved.
                self.__getImage = self.__serviceObj.plotImage(self.__getData[1])

                if self.__getImage[0]:
                    # generate image payload for registry.
                    registry_payload = self.__serviceObj.generatePayload(status = 1, id=self.__payload["id"], user=self.__payload["data"]["userId"], encoded_image=self.__getImage[1], comments="image plot success.")
                else:
                    # generate error mesg for registry.
                    registry_payload = self.__serviceObj.generatePayload(status = -1, id=self.__payload["id"], user=self.__payload["data"]["userId"], comments="image plot failed.")
            
            else:
                # generate error mesg for registry.
                registry_payload = self.__serviceObj.generatePayload(status = -1, id=self.__payload["id"], user=self.__payload["data"]["userId"], comments="nexrad data download failed.")
                
        else:
            # generate error mesg for registry.
            registry_payload = self.__serviceObj.generatePayload(status = -1, id=self.__payload["id"], user=self.__payload["data"]["userId"], comments="input validation failed.")
        
        self.__publisherObj.publish(queue = "elves.registry.applog.in", exchange = "elvesExchange", body = registry_payload)
        
    



    

        