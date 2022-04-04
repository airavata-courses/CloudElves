from services.merra_services import MerraService

MerraService.startMerraService('6e187992-6cb3-4e3e-9133-4efaee37a69a ', {
                    "product": "M2I3NPASM_V5.12.4",
                    "startDate": "2022-01-01",
                    "endDate": "2022-01-02",
                    "varNames": ["T"],
                    "outputType": "gif",
                    "userId": "asangar"
                })