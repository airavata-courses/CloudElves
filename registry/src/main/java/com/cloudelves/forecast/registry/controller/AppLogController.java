package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.dao.AppLog;
import com.cloudelves.forecast.registry.dao.UserDetails;
import com.cloudelves.forecast.registry.model.request.AppLogRequest;
import com.cloudelves.forecast.registry.model.response.AppLogResponse;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import com.cloudelves.forecast.registry.model.response.DefaultSuccess;
import com.cloudelves.forecast.registry.repository.AppLogRepository;
import com.cloudelves.forecast.registry.repository.UserDetailsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.*;

@RestController
@Slf4j
public class AppLogController {

    @Autowired
    private AppLogRepository appLogRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @GetMapping(value = "/getAppLog")
    public ResponseEntity getAppLog(@RequestParam(name = "userId") String userId) {
        try {
            List<AppLog> appLogs = appLogRepository.findByUserId(userId);
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
            Date timestamp = new Date(Long.parseLong(appLogRequest.getTimestamp()));
            AppLog appLog = new AppLog(UUID.randomUUID().toString(), userDetailsOpt.get(), appLogRequest.getServiceId(),
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
}
