package com.cloudelves.forecast.gateway.controller;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.registry.response.PlotRequestResponse;
import com.cloudelves.forecast.gateway.model.registry.response.UserDetailsResponse;
import com.cloudelves.forecast.gateway.model.registry.response.UserEventResponse;
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

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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

    @Value("${registry.apiPath.getEvents}")
    private String getAppLogPath;

    @Value("${registry.apiPath.getHistory}")
    private String getHistoryPath;

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
        String kubernetesIp = System.getenv(registryServiceName + "_SERVICE_HOST");
        String kubernetesPort = System.getenv(registryServiceName + "_SERVICE_PORT");
        if (kubernetesIp != null && kubernetesPort != null) {
            log.info("pointing to kube cluster");
            this.baseUrl = String.format("http://%s:%s", kubernetesIp, kubernetesPort);
        } else {
            log.info("pointing to local");
            this.baseUrl = String.format("http://%s:%s", registryHost, registryPort);
        }
        log.info("set baseUrl: {}", baseUrl);
    }

    @GetMapping(value = "/getUser")
    public ResponseEntity getUser(@RequestHeader(value = "id_token") String token, @RequestHeader(value = "name") String username,
                                  @RequestHeader(value = "email") String email) throws BaseException {
        String id = UUID.randomUUID().toString();
        userService.checkAndAddUser(id, username, username, email);
        try {
            String url = baseUrl + getUserPath;
            Map<String, String> requestParams = Collections.singletonMap("userId", username);
            UserDetailsResponse responseBody = restService.makeRestCall(url, null, UserDetailsResponse.class, requestParams,
                                                                        HttpMethod.GET);
            logService.logEvent(id, username, Constants.EVENT_GET_USER);
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            throw e;
        }
    }

    @GetMapping(value = "/getEvents")
    public ResponseEntity getEvents(@RequestHeader(value = "id_token") String token, @RequestHeader(value = "name") String username,
                                    @RequestHeader(value = "email") String email,
                                    @RequestParam(value = "numItems", required = false, defaultValue = "10")
                                            int numItems) throws BaseException {
        String id = UUID.randomUUID().toString();
        try {
            String url = baseUrl + getAppLogPath;
            Map<String, String> requestParams = new HashMap<>();
            requestParams.put("userId", username);
            requestParams.put("all", String.valueOf(numItems));
            UserEventResponse[] responseBody = restService.makeRestCall(url, null, UserEventResponse[].class, requestParams,
                                                                        HttpMethod.GET);
            logService.logEvent(id, username, Constants.EVENT_GET_EVENTS);
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            throw e;
        }
    }

    @GetMapping(value = "/history")
    public ResponseEntity getHistory(@RequestHeader(value = "id_token") String token, @RequestHeader(value = "name") String username,
                                    @RequestHeader(value = "email") String email) throws BaseException {
        String id = UUID.randomUUID().toString();
        try {
            String url = baseUrl + getHistoryPath;
            log.info("url: {}", url);
            Map<String, String> requestParams = new HashMap<>();
            requestParams.put("userId", username);
            PlotRequestResponse[] responseBody = restService.makeRestCall(url, null, PlotRequestResponse[].class, requestParams,
                                                                          HttpMethod.GET);
            logService.logEvent(id, username, Constants.EVENT_GET_HISTORY);
            return ResponseEntity.ok(responseBody);
        } catch (BaseException e) {
            throw e;
        }
    }

}
