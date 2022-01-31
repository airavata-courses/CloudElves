package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.configuration.RestConfig;
import com.cloudelves.forecast.gateway.exception.BaseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class RestService {

    @Autowired
    private RestTemplate restTemplate;

    public <T, G> T makeRestCall(String url, G requestBody, Class responseClass, Map<String, String> requestParams,
                                 HttpMethod method) throws BaseException {
        try {
            if (method == HttpMethod.GET) {
                requestParams = requestParams == null ? new HashMap<>() : requestParams;
                return (T) restTemplate.getForEntity(url, responseClass, requestParams).getBody();
            } else if (method == HttpMethod.POST) {
                return (T) restTemplate.postForEntity(url, requestBody, responseClass);
            } else {
                throw new BaseException("unsupported http method");
            }
        } catch (RestClientException e) {
            String errorMessage = String.format("error while making rest call: %s", e.getMessage());
            log.error(errorMessage);
            throw new BaseException(errorMessage);
        } catch (Exception e) {
            String errorMessage = String.format("error while making rest call: %s", e.getMessage());
            log.error(errorMessage);
            throw new BaseException(errorMessage);
        }
    }

}
