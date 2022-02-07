package com.cloudelves.forecast.gateway.controller;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.forecaster.response.ForecastResponse;
import com.cloudelves.forecast.gateway.model.forecaster.response.StormResponse;
import com.cloudelves.forecast.gateway.model.ingestor.response.GetDataResponse;
import com.cloudelves.forecast.gateway.model.request.DataRequest;
import com.cloudelves.forecast.gateway.model.registry.response.AppLogResponse;
import com.cloudelves.forecast.gateway.model.registry.response.UserDetailsResponse;
import com.cloudelves.forecast.gateway.model.response.DataResponse;
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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

import javax.annotation.PostConstruct;

@RestController
@Slf4j
public class IngestorController {

    @Value("${ingestor.host}")
    private String ingestorHost;

    @Value("${ingestor.port}")
    private String ingestorPort;

    @Value("${forecaster.host}")
    private String forecasterHost;

    @Value("${forecaster.port}")
    private String forecasterPort;

    private String ingestorBaseUrl;
    private String forecasterBaseUrl;

    @Value("${ingestor.apiPath.getData}")
    private String getDataPath;

    @Value("${ingestor.apiPath.getImage}")
    private String getImagePath;


    @Value("${forecaster.apiPath.storm}")
    private String stormPath;

    @Value("${forecaster.apiPath.forecast}")
    private String forecastPath;

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
        ingestorBaseUrl = String.format("http://{}.{}", ingestorHost, ingestorPort);
        forecasterBaseUrl = String.format("http://{}.{}", forecasterHost, forecasterPort);
        log.info("set ingestorBaseUrl: {}", ingestorBaseUrl);
        log.info("set forecasterBaseUrl: {}", forecasterBaseUrl);
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PostMapping(value = "/data")
    public ResponseEntity getUser(@RequestHeader Map<String, String> headers, @RequestBody
            DataRequest dataRequest) throws BaseException, AuthenticationException {
        String token = headers.getOrDefault(Constants.TOKEN_HEADER, "");
        String username = headers.get(Constants.USERNAME_HEADER);
        String email = headers.get(Constants.EMAIL_HEADER);
        authenticationService.verifyToken(token, username, email);
        userService.checkAndAddUser(username, username, email);

        GetDataResponse ingestorResponse;
        StormResponse stormResponse;
        String imageUrl;
        try {
            String url = ingestorBaseUrl + getDataPath;
            log.info("ingestor get data url: {}", url);
            Map<String, String> requestParams = populateQueryParams(dataRequest);
            ingestorResponse = restService.makeRestCall(url, null, GetDataResponse.class, requestParams,
                                                        HttpMethod.GET);
            logService.logEvent(username, "ingestor", "getData", 0, "successfully queried weather data");
        } catch (BaseException e) {
            logService.logEvent(username, "ingestor", "getData", 1, e.getMessage());
            throw e;
        }

        imageUrl = ingestorBaseUrl + getImagePath + "?filename=" + ingestorResponse.getData();
        DataResponse responseBody = DataResponse.builder().imageUrl(imageUrl).build();

        try {
            String stormUrl = forecasterBaseUrl + stormPath;
            stormResponse = restService.makeRestCall(stormUrl, null, StormResponse.class, null, HttpMethod.GET);
            responseBody.setStormExist(stormResponse.isStorm());
            logService.logEvent(username, "forecaster", "stormClustering", 0, "successfully performed storm clustering");
        } catch (Exception e) {
            logService.logEvent(username, "forecaster", "stormClustering", 1, e.getMessage());
            throw e;
        }

        try {
            log.info("storm exists: {}", stormResponse.isStorm());
            if (stormResponse.isStorm()) {
                String forecastUrl = forecasterBaseUrl + forecastPath;
                ForecastResponse forecastResponse = restService.makeRestCall(forecastUrl, null, ForecastResponse.class, null,
                                                                             HttpMethod.GET);
                logService.logEvent(username, "forecaster", "forecast", 0, "successfully performed weather forecast");
                responseBody.setWeatherForecast(forecastResponse);
            }

        } catch (Exception e) {
            logService.logEvent(username, "forecaster", "forecast", 1, e.getMessage());
            throw e;
        }

        return ResponseEntity.ok(responseBody);

    }

    private Map<String, String> populateQueryParams(DataRequest dataRequest) {
        Map<String, String> requestParams = new HashMap<>();
        String monthString = dataRequest.getMonth() < 10 ? "0" + dataRequest.getMonth().toString() : dataRequest.getMonth().toString();
        String dayString = dataRequest.getMonth() < 10 ? "0" + dataRequest.getDay().toString() : dataRequest.getDay().toString();
        requestParams.put("year", dataRequest.getYear().toString());
        requestParams.put("month", monthString);
        requestParams.put("day", dayString);
        requestParams.put("startTime", dataRequest.getStartTime());
        requestParams.put("endTime", dataRequest.getEndTime());
        requestParams.put("radar", dataRequest.getRadarStation());
        requestParams.put("id", UUID.randomUUID().toString());
        log.info("requestParameters: {}", requestParams);
        return requestParams;
    }
    
}
