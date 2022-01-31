package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.model.ingestor.request.UserDetailsRequest;
import com.cloudelves.forecast.gateway.model.ingestor.response.UserDetailsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
public class UserService {

    @Value("${registry.baseUrl}")
    private String baseUrl;

    @Value("${registry.apiPath.addUser}")
    private String addUserPath;

    @Autowired
    private LogService logService;

    @Autowired
    private RestService restService;

    public void checkAndAddUser(String userId, String username, String email) {
        String url = baseUrl + addUserPath;
        String timestamp = String.format("%d", new Date().getTime());
        UserDetailsRequest requestBody = UserDetailsRequest.builder().userId(userId).userEmail(email).name(username).timestamp(timestamp)
                                                           .build();
        try {
            restService.makeRestCall(url, requestBody, String.class, null, HttpMethod.POST);
            logService.logEvent(userId, "registry", "addUser", 0, "successfully added user");
        } catch (Exception e) {
            if (!e.getMessage().contains("user already registered")) {
                log.error("error while registering user: ", e);
                logService.logEvent(userId, "registry", "addUser", 1, e.getMessage());
            }
        }
    }

}
