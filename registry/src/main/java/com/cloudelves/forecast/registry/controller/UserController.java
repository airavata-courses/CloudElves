package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.dao.AppLog;
import com.cloudelves.forecast.registry.dao.UserDetails;
import com.cloudelves.forecast.registry.model.request.AppLogRequest;
import com.cloudelves.forecast.registry.model.request.UserDetailsRequest;
import com.cloudelves.forecast.registry.model.response.AppLogResponse;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import com.cloudelves.forecast.registry.model.response.DefaultSuccess;
import com.cloudelves.forecast.registry.model.response.UserDetailsResponse;
import com.cloudelves.forecast.registry.repository.AppLogRepository;
import com.cloudelves.forecast.registry.repository.UserDetailsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@Slf4j
public class UserController {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @GetMapping(value = "/getUsers")
    public ResponseEntity getAllUsers() {
        Iterable<UserDetails> userDetailsOpt = userDetailsRepository.findAll();
        List<UserDetailsResponse> userDetailsList = new ArrayList<>();
        userDetailsOpt.forEach(userDetails -> userDetailsList.add(
                UserDetailsResponse.builder().userId(userDetails.getUserId()).userEmail(userDetails.getUserEmail())
                                   .active(userDetails.isActive())
                                   .timestamp(userDetails.getRegisterTimestamp().toString()).build()));
        return ResponseEntity.ok(userDetailsList);
    }

    @GetMapping(value = "/getUser/{userId}")
    public ResponseEntity getUser(@PathVariable String userId) {
        Optional<UserDetails> userDetailsOpt = userDetailsRepository.findById(userId);
        if (userDetailsOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            UserDetails userDetails = userDetailsOpt.get();
            return ResponseEntity.ok(UserDetailsResponse.builder().userId(userDetails.getUserId()).userEmail(userDetails.getUserEmail())
                                                        .active(userDetails.isActive())
                                                        .timestamp(userDetails.getRegisterTimestamp().toString()).build());
        }
    }

    @PostMapping(value = "/addUser")
    public ResponseEntity addUser(@RequestBody UserDetailsRequest userDetailsRequest) {
        try {
            Optional<UserDetails> userDetailsOpt = userDetailsRepository.findById(userDetailsRequest.getUserId());
            if (userDetailsOpt.isPresent()) {
                DefaultError error = DefaultError.builder().error("user already registered").statusCode(HttpStatus.BAD_REQUEST.toString())
                                                 .build();
                return ResponseEntity.badRequest().body(error);
            }
            Date timestamp = new Date(Long.parseLong(userDetailsRequest.getTimestamp()));
            UserDetails userDetails = UserDetails.builder().userId(userDetailsRequest.getUserId())
                                                 .userEmail(userDetailsRequest.getUserEmail()).registerTimestamp(timestamp).active(true)
                                                 .build();
            userDetailsRepository.save(userDetails);
            return ResponseEntity.ok(
                    DefaultSuccess.builder().message("successfully registered user").statusCode(HttpStatus.CREATED.toString()).build());
        } catch (Exception e) {
            DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                             .build();
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
