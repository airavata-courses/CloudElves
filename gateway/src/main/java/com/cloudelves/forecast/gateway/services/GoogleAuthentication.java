package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Profile("google")
@Service
@Slf4j
public class GoogleAuthentication implements IAuthenticate {

    @Autowired
    private RestService restService;

    @Value("${google.tokenUrl}")
    private String tokenUrl;

    public boolean verifyToken(String token, String username, String email) throws AuthenticationException {
        Map<String, String> requestParams = Collections.singletonMap("token", token);
        try {
            String response = restService.makeRestCall(tokenUrl, null, String.class, requestParams, HttpMethod.GET);
            return response.contains("username") && response.contains("email");
        } catch (BaseException e) {
            log.error("error while verifying token: ", e);
            throw new AuthenticationException(e.getMessage());
        }
    }

}
