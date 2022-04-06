package com.cloudelves.forecast.gateway.controller;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.events.IngestorGetDataEvent;
import com.cloudelves.forecast.gateway.model.ingestor.request.MeraRequest;
import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import com.cloudelves.forecast.gateway.model.ingestor.response.ImageResponse;
import com.cloudelves.forecast.gateway.model.registry.response.PlotRequestResponse;
import com.cloudelves.forecast.gateway.model.response.DataResponse;
import com.cloudelves.forecast.gateway.model.response.MeraDataResponse;
import com.cloudelves.forecast.gateway.services.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class IngestorController {

    private LogService logService;
    private DataService dataService;
    private IngestorService ingestorService;

    public IngestorController(LogService logService, DataService dataService, IngestorService ingestorService) {
        this.logService = logService;
        this.dataService = dataService;
        this.ingestorService = ingestorService;
    }

    @PostMapping(value = "/nexrad/data")
    public ResponseEntity getData(@RequestHeader(value = "id_token") String token, @RequestHeader(value = "name") String username,
                                  @RequestHeader(value = "email") String email,
                                  @RequestBody NexradRequest nexradRequest) throws BaseException {
        validateIngestorRequest(nexradRequest);
        String requestId = dataService.sendNexradPlotRequest(username, nexradRequest);
        String logId = UUID.randomUUID().toString();
        logService.logEvent(logId, username, Constants.EVENT_GET_DATA_NEXRAD);
        return ResponseEntity.ok(DataResponse.builder().id(requestId).build());
    }

    @PostMapping(value = "/mera/data")
    public ResponseEntity getMeraData(@RequestHeader(value = "id_token") String token, @RequestHeader(value = "name") String username,
                                  @RequestHeader(value = "email") String email,
                                  @RequestBody MeraRequest meraRequest) throws BaseException {
        Map<String, String> requestIdList = dataService.sendMeraPlotRequest(username, meraRequest);
        String logId = UUID.randomUUID().toString();
        logService.logEvent(logId, username, Constants.EVENT_GET_DATA_NEXRAD);
        return ResponseEntity.ok(MeraDataResponse.builder().id(requestIdList).build());
    }

    @GetMapping(value = "/status")
    public ResponseEntity<PlotRequestResponse> getStatus(@RequestHeader(value = "id_token") String token,
                                                         @RequestHeader(value = "name") String username,
                                                         @RequestHeader(value = "email") String email,
                                                         @RequestParam("id") String id) throws BaseException {
        PlotRequestResponse plotRequestResponse = dataService.getRequestById(id);
        return ResponseEntity.ok(plotRequestResponse);
    }

    @GetMapping(value = "/image")
    public ResponseEntity<ImageResponse> getImage(@RequestHeader(value = "id_token") String token,
                                                  @RequestHeader(value = "name") String username,
                                                  @RequestHeader(value = "email") String email,
                                                  @RequestParam("id") String id) throws BaseException {
        return ResponseEntity.ok(ingestorService.getImage(id));
    }

    private void validateIngestorRequest(NexradRequest ingestorRequest) {
        String day = ingestorRequest.getDay().length() == 1 ? "0" + ingestorRequest.getDay() : ingestorRequest.getDay();
        String month = ingestorRequest.getMonth().length() == 1 ? "0" + ingestorRequest.getMonth() : ingestorRequest.getMonth();
        ingestorRequest.setDay(day);
        ingestorRequest.setMonth(month);
    }

}
