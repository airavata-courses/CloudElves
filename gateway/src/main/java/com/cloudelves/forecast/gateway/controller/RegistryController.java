package com.cloudelves.forecast.gateway.controller;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.registry.response.AppLogResponse;
import com.cloudelves.forecast.gateway.model.registry.response.UserDetailsResponse;
import com.cloudelves.forecast.gateway.services.IAuthenticate;
import com.cloudelves.forecast.gateway.services.LogService;
import com.cloudelves.forecast.gateway.services.RestService;
import com.cloudelves.forecast.gateway.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.annotation.PostConstruct;

@RestController
@Slf4j
@CrossOrigin
public class RegistryController {

    @Value("${registry.host}")
    private String registryHost;

    @Value("${registry.port}")
    private String registryPort;

    @Value("${registry.serviceName}")
    private String registryServiceName;

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

    @PostConstruct
    public void setBaseUrl() {
        String kubernetesIp = System.getenv(registryServiceName+"_SERVICE_HOST");
        String kubernetesPort = System.getenv(registryServiceName+"_SERVICE_PORT");
        if(kubernetesIp != null && kubernetesPort!=null) {
            log.info("pointing to kube cluster");
            this.baseUrl = String.format("http://%s:%s", kubernetesIp, kubernetesPort);
        } else {
            log.info("pointing to local");
            this.baseUrl = String.format("http://%s:%s", registryHost, registryPort);
        }
        log.info("set baseUrl: {}", baseUrl);
    }

    @GetMapping(value = "/getUser")
    public ResponseEntity getUser(@RequestHeader Map<String, String> headers) throws BaseException, AuthenticationException {
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        authenticationService.verifyToken(token, username, email);
        String id = UUID.randomUUID().toString();
        userService.checkAndAddUser(id, username, username, email);
        try {
            String url = baseUrl + getUserPath;
            Map<String, String> requestParams = Collections.singletonMap("userId", username);
            UserDetailsResponse responseBody = restService.makeRestCall(url, null, UserDetailsResponse.class, requestParams,
                                                                        HttpMethod.GET);
            logService.logEvent(id, username, "registry", "getUser", 0, "successfully queried user details");
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            logService.logEvent(id, username, "registry", "getUser", 2, e.getMessage());
            throw e;
        }
    }

    @GetMapping(value = "/getLogs")
    public ResponseEntity getLogs(@RequestHeader Map<String, String> headers,
                                  @RequestParam(value = "all", required = false, defaultValue = "false")
                                          boolean all) throws BaseException, AuthenticationException {
        log.info("headers: {}", headers);
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String defaultToken = headers.get(Constants.TOKEN_HEADER);
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        String id = UUID.randomUUID().toString();
        log.info("user: {}, email: {}", username, email);
        authenticationService.verifyToken(token, username, email);
        userService.checkAndAddUser(id, username, username, email);
        try {
            String url = baseUrl + getAppLogPath;
            Map<String, String> requestParams = new HashMap<>();
            requestParams.put("userId", username);
            requestParams.put("all", String.valueOf(all));
            AppLogResponse[] responseBody = restService.makeRestCall(url, null, AppLogResponse[].class, requestParams,
                                                                     HttpMethod.GET);
            logService.logEvent(id, username, "registry", "getAppLogs", 0, "successfully queried logs");
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            logService.logEvent(id, username, "registry", "getAppLogs", 1, e.getMessage());
            throw e;
        }
    }

}
