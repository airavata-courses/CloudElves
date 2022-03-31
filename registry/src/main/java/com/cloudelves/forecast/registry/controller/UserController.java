package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.exceptions.UserNotFoundException;
import com.cloudelves.forecast.registry.exceptions.UserServicesException;
import com.cloudelves.forecast.registry.model.request.UserDetailsRequest;
import com.cloudelves.forecast.registry.model.response.DefaultSuccess;
import com.cloudelves.forecast.registry.model.response.PlotRequestResponse;
import com.cloudelves.forecast.registry.model.response.UserDetailsResponse;
import com.cloudelves.forecast.registry.services.UserRequestsService;
import com.cloudelves.forecast.registry.services.UserServices;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private UserServices userServices;
    private UserRequestsService userRequestsService;

    public UserController(UserServices userServices, UserRequestsService userRequestsService) {
        this.userServices = userServices;
        this.userRequestsService = userRequestsService;
    }

    @GetMapping(value = "/getUser")
    public ResponseEntity<UserDetailsResponse> getUser(
            @RequestParam("userId") String userId) throws UserNotFoundException, UserServicesException {
        return ResponseEntity.ok(userServices.getUserDetails(userId));
    }


    @PostMapping(value = "/addUser")
    public ResponseEntity<DefaultSuccess> addUser(@RequestBody UserDetailsRequest userDetailsRequest) throws UserServicesException {
        userServices.addUserDetails(userDetailsRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(DefaultSuccess.builder().message(
                String.format("successfully added user %s", userDetailsRequest.getUserId())).build());
    }

    @GetMapping(value = "/getUserRequests")
    public ResponseEntity<List<PlotRequestResponse>> getUserRequests(@RequestParam("userId") String userId) {
        return ResponseEntity.ok(userRequestsService.getUserRequests(userId));
    }
}
