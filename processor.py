from services import Services
from publisher import Publisher
import os 

class Processor:
    def __init__(self,payload) -> None:
        self.registryQueue = os.getenv('registry_op_queue') or 'elves.registry.ingestor.in'
        self.payload = payload
        self.serviceObj = Services()        
        self.isValid = self.serviceObj.isValid(self.payload["data"])
        self.publisherObj = Publisher()
        
        """
            Sample JSON input:
            {
                "data": {
                    "year": "2022",
                    "month": "02",
                    "day": "02",
                    "startTime": "1643807400279",
                    "endTime": "1643807400279",
                    "radar": "KAKQ",
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
        # Check if input parameters are valid.
        if self.isValid[0]:

            self.__getData = self.serviceObj.getData(self.payload["data"], self.payload["id"])    
            
            # Check registry for image presence.
            # code...
            # if not download
            if self.__getData[0]:

                print("Data downloaded!")
                # plot image out of data recieved.
                self.__getImage = self.serviceObj.plotImage(self.__getData[1], self.payload["id"])
                
                if self.__getImage[0]:
                    # generate image payload for registry.
                    print("Data plots generated! ")
                    registry_payload = self.serviceObj.generatePayload(status = 1, id=self.payload["id"], user=self.payload["data"]["userId"], encoded_image=self.__getImage[1], comments="image plot success.")
                else:
                    # generate error mesg for registry.
                    registry_payload = self.serviceObj.generatePayload(status = -1, id=self.payload["id"], user=self.payload["data"]["userId"], comments="image plot failed.")
            
            else:
                # generate error mesg for registry.
                registry_payload = self.serviceObj.generatePayload(status = -1, id=self.payload["id"], user=self.payload["data"]["userId"], comments="nexrad data download failed.")
                
        else:
            # generate error mesg for registry.
            registry_payload = self.serviceObj.generatePayload(status = -1, id=self.payload["id"], user=self.payload["data"]["userId"], comments="input validation failed.")
        
        self.publisherObj.publish(queue = self.registryQueue, exchange = "elvesExchange", body = registry_payload)
        