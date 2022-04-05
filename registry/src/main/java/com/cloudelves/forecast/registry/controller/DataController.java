package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.dao.MeraData;
import com.cloudelves.forecast.registry.dao.NexradData;
import com.cloudelves.forecast.registry.exceptions.DataServiceException;
import com.cloudelves.forecast.registry.model.request.MeraDataPostRequest;
import com.cloudelves.forecast.registry.model.response.*;
import com.cloudelves.forecast.registry.services.DataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("data")
public class DataController {

    private DataService dataService;

    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping(value = "/nexrad")
    public ResponseEntity getNexradData(@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime,
                                        @RequestParam("radarName") String radarName) {
        NexradData nexradData = dataService.getNexradData(startTime, endTime, radarName);
        if (nexradData == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(DefaultError.builder().error("data not found").statusCode(HttpStatus.NOT_FOUND.toString()).build());
        }
        return ResponseEntity.ok(nexradData);
    }

    @GetMapping(value = "/nexrad/all")
    public ResponseEntity<List<NexradData>> getAllNexradData() {
        return ResponseEntity.ok(dataService.getAllNexradData());
    }

    @PostMapping(value = "/mera")
    public ResponseEntity<MeraDataResponse> getMeraData(@RequestBody MeraDataPostRequest meraDataPostRequest) {
        return ResponseEntity.ok(dataService.getMeraData(meraDataPostRequest.getDates(), meraDataPostRequest.getVariable()));
    }

    @GetMapping(value = "/mera/all")
    public ResponseEntity<List<MeraData>> getAllMeraData() {
        return ResponseEntity.ok(dataService.getAllMeraData());
    }


    @PostMapping(value = "/nexrad/update")
    public ResponseEntity<DefaultSuccess> updateNexradData(
            @RequestBody IngestorNexradDataResponse ingestorNexradDataResponse) throws DataServiceException {
        dataService.updateNexradService(ingestorNexradDataResponse);
        return ResponseEntity.ok(DefaultSuccess.builder().message("successfully updated").build());
    }

    @PostMapping(value = "/mera/update")
    public ResponseEntity<DefaultSuccess> updateMeraData(
            @RequestBody IngestorMeraDataResponse ingestorMeraDataResponse) throws DataServiceException {
        dataService.updateMeraData(ingestorMeraDataResponse);
        return ResponseEntity.ok(DefaultSuccess.builder().message("successfully updated").build());
    }
}
