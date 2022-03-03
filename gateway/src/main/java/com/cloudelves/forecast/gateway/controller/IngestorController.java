package com.cloudelves.forecast.gateway.controller;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.events.IngestorGetDataEvent;
import com.cloudelves.forecast.gateway.model.forecaster.response.ForecastResponse;
import com.cloudelves.forecast.gateway.model.forecaster.response.StormResponse;
import com.cloudelves.forecast.gateway.model.ingestor.request.IngestorRequest;
import com.cloudelves.forecast.gateway.model.ingestor.response.GetDataResponse;
import com.cloudelves.forecast.gateway.model.request.DataRequest;
import com.cloudelves.forecast.gateway.model.registry.response.AppLogResponse;
import com.cloudelves.forecast.gateway.model.registry.response.UserDetailsResponse;
import com.cloudelves.forecast.gateway.model.response.DataResponse;
import com.cloudelves.forecast.gateway.services.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

import javax.annotation.PostConstruct;

@RestController
@Slf4j
public class IngestorController {

    @Value("${rmq.output.ingestor}")
    private String ingestorQueue;

    @Autowired
    private LogService logService;

    @Autowired
    private IAuthenticate authenticationService;

    @Autowired
    private UserService userService;

    @Autowired
    private RMQProducer rmqProducer;

    @Autowired
    private RegistryService registryService;

    @CrossOrigin(origins = {"http://ui:3001", "http://localhost:3001"})
    @PostMapping(value = "/data")
    public ResponseEntity getData(@RequestHeader Map<String, String> headers, @RequestBody
            IngestorRequest ingestorRequest) throws BaseException, AuthenticationException {
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        authenticationService.verifyToken(token, username, email);

        String id = UUID.randomUUID().toString();
        userService.checkAndAddUser(id, username, username, email);

        IngestorGetDataEvent getDataEvent = IngestorGetDataEvent.builder().source(Constants.SOURCE_GATEWAY)
                                                                .datacontentType(Constants.DATA_CONTENT_TYPE)
                                                                .time(String.valueOf(new Date().getTime())).id(id)
                                                                .type(Constants.INGESTOR_GET_DATA).data(ingestorRequest).build();
        rmqProducer.produceMessage(ingestorQueue, getDataEvent);
        logService.logEvent(id, username, Constants.COMPONENT_INGESTOR, Constants.INGESTOR_GET_DATA, 0, "requested data");
        return ResponseEntity.ok(DataResponse.builder().id(id).build());
    }

    @GetMapping(value = "/status")
    public ResponseEntity getStatus(@RequestHeader Map<String, String> headers,
                                    @RequestParam("id") String id) throws BaseException, AuthenticationException {
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        authenticationService.verifyToken(token, username, email);
        return ResponseEntity.ok(registryService.getDataStatusResponse(id));
    }


}
