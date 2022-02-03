package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.registry.request.AppLogRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
public class LogService {

    @Autowired
    private RestService restService;

    @Value("${registry.baseUrl}")
    private String baseUrl;

    @Value("${registry.apiPath.addAppLog}")
    private String addLogPath;

    public void logEvent(String userId, String serviceId, String action, int status, String comments) {
        String url = baseUrl + addLogPath;
        String timestamp = String.format("%d", new Date().getTime());
        AppLogRequest appLogRequest = AppLogRequest.builder().userId(userId).serviceId(serviceId).action(action).status(status)
                                                   .timestamp(timestamp).comments(comments).build();
        try {
            restService.makeRestCall(url, appLogRequest, String.class, null, HttpMethod.POST);
            log.error("successfully logged event");
        } catch (BaseException e) {
            log.error("error while logging: ", e);
        }
    }

}
