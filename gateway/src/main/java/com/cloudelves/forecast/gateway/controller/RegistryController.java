package com.cloudelves.forecast.gateway.controller;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.ingestor.response.AppLogResponse;
import com.cloudelves.forecast.gateway.model.ingestor.response.UserDetailsResponse;
import com.cloudelves.forecast.gateway.model.response.DefaultError;
import com.cloudelves.forecast.gateway.services.IAuthenticate;
import com.cloudelves.forecast.gateway.services.LogService;
import com.cloudelves.forecast.gateway.services.RestService;
import com.cloudelves.forecast.gateway.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
public class RegistryController {

    @Value("${registry.baseUrl}")
    private String baseUrl;

    @Value("${registry.apiPath.getUser}")
    private String getUserPath;

    @Value("${registry.apiPath.getAppLog}")
    private String getAppLogPath;

    @Autowired
    private RestService restService;

    @Autowired
    private LogService logService;

    @Autowired
    private IAuthenticate authenticationService;

    @Autowired
    private UserService userService;

    @GetMapping(value = "/getUser")
    public ResponseEntity getUser(@RequestHeader Map<String, String> headers,
                                  @RequestParam("userId") String userId) throws BaseException, AuthenticationException {
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        authenticationService.verifyToken(token, username, email);
        userService.checkAndAddUser(userId, username, email);
        try {
            String url = baseUrl + getUserPath;
            Map<String, String> requestParams = Collections.singletonMap("userId", userId);
            UserDetailsResponse responseBody = restService.makeRestCall(url, null, UserDetailsResponse.class, requestParams,
                                                                        HttpMethod.GET);
            logService.logEvent(userId, "registry", "getUser", 0, "successfully queried user details");
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            logService.logEvent(userId, "registry", "getUser", 1, e.getMessage());
            throw e;
        }
    }

    @GetMapping(value = "/getLogs")
    public ResponseEntity getLogs(@RequestHeader Map<String, String> headers,
                                  @RequestParam("userId") String userId) throws BaseException, AuthenticationException {
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        authenticationService.verifyToken(token, username, email);
        userService.checkAndAddUser(userId, username, email);
        try {
            String url = baseUrl + getAppLogPath;
            Map<String, String> requestParams = Collections.singletonMap("userId", userId);
            AppLogResponse[] responseBody = restService.makeRestCall(url, null, AppLogResponse[].class, requestParams,
                                                                        HttpMethod.GET);
            logService.logEvent(userId, "registry", "getAppLogs", 0, "successfully queried logs");
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            logService.logEvent(userId, "registry", "getAppLogs", 1, e.getMessage());
            throw e;
        }
    }

}
