package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.dao.AppLog;
import com.cloudelves.forecast.registry.dao.Plots;
import com.cloudelves.forecast.registry.dao.UserDetails;
import com.cloudelves.forecast.registry.model.request.AppLogRequest;
import com.cloudelves.forecast.registry.model.response.AppLogResponse;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import com.cloudelves.forecast.registry.model.response.DefaultSuccess;
import com.cloudelves.forecast.registry.repository.AppLogRepository;
import com.cloudelves.forecast.registry.repository.PlotsRepository;
import com.cloudelves.forecast.registry.repository.UserDetailsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@RestController
@Slf4j
public class AppLogController {

    @Autowired
    private AppLogRepository appLogRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private PlotsRepository plotsRepository;

    @GetMapping(value = "/getAppLog")
    public ResponseEntity getAppLog(@RequestParam(name = "userId") String userId,
                                    @RequestParam(value = "all", required = false, defaultValue = "false")
                                            boolean all) {
        try {
            List<AppLog> appLogs;
            if (all) {
                appLogs = appLogRepository.findByUserId(userId);
            } else {
                appLogs = appLogRepository.findByUserIdLatest(userId);
            }
            ArrayList<AppLogResponse> appLogList = new ArrayList<>();
            appLogs.forEach(x -> appLogList.add(AppLogResponse.builder().userId(x.getUser().getUserId()).id(x.getId())
                                                              .serviceId(x.getServiceId()).timestamp(x.getLogTimestamp().toString())
                                                              .comments(x.getComments()).status(x.getStatus()).action(x.getAction())
                                                              .build()));
            return ResponseEntity.ok(appLogList);
        } catch (Exception e) {
            log.error("error while querying app logs: ", e);
            return ResponseEntity.internalServerError()
                                 .body(DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                                   .build());
        }
    }

    @PostMapping(value = "/addAppLog")
    public ResponseEntity addAppLog(@RequestBody AppLogRequest appLogRequest) {
        try {
            Optional<UserDetails> userDetailsOpt = userDetailsRepository.findById(appLogRequest.getUserId());
            if (userDetailsOpt.isEmpty()) {
                DefaultError error = DefaultError.builder().error("invalid user").statusCode(HttpStatus.BAD_REQUEST.toString()).build();
                return ResponseEntity.badRequest().body(error);
            }
            Timestamp timestamp = Timestamp.from(Instant.ofEpochSecond(Long.parseLong(appLogRequest.getTimestamp())));
            AppLog appLog = new AppLog(appLogRequest.getId(), userDetailsOpt.get(), appLogRequest.getServiceId(),
                                       appLogRequest.getAction(), timestamp, appLogRequest.getStatus(), appLogRequest.getComments());
            appLogRepository.save(appLog);
            return ResponseEntity.ok(
                    DefaultSuccess.builder().message("successfully persisted log").statusCode(HttpStatus.CREATED.toString()).build());
        } catch (Exception e) {
            log.error("error while persisting log: ", e);
            DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                             .build();
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping(value = "/getLogs")
    public ResponseEntity getLogsById(@RequestParam(name = "id") String id) {
        try {
            List<AppLog> appLogs = appLogRepository.findByTransactionId(id);
            ArrayList<AppLogResponse> appLogList = new ArrayList<>();
            appLogs.forEach(x -> appLogList.add(AppLogResponse.builder().userId(x.getUser().getUserId()).id(x.getId())
                                                              .serviceId(x.getServiceId()).timestamp(x.getLogTimestamp().toString())
                                                              .comments(x.getComments()).status(x.getStatus()).action(x.getAction())
                                                              .build()));
            return ResponseEntity.ok(appLogList);
        } catch (Exception e) {
            log.error("error while querying app logs: ", e);
            return ResponseEntity.internalServerError()
                                 .body(DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                                   .build());
        }
    }

    @PostMapping(value = "/getImage")
    public ResponseEntity getPlotsById(@RequestParam(name = "id") String id) {
        Optional<Plots> plotOpt = plotsRepository.findById(id);
        if(plotOpt.isEmpty()) {
            String errorMessage = String.format("no plot found for id {}", id);
            log.error(errorMessage);
            return ResponseEntity.internalServerError()
                                 .body(DefaultError.builder().error(errorMessage).statusCode(HttpStatus.NOT_FOUND.toString())
                                                   .build());
        } else {
            return ResponseEntity.ok(plotOpt.get());
        }
    }
}
