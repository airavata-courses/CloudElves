package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.events.CreatePlotRequestEvent;
import com.cloudelves.forecast.gateway.model.events.IngestorGetDataEvent;
import com.cloudelves.forecast.gateway.model.ingestor.request.CreatePlotRequest;
import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import com.cloudelves.forecast.gateway.model.registry.response.PlotRequestResponse;
import com.cloudelves.forecast.gateway.model.registry.response.UserDetailsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;

@Service
@Slf4j
public class DataService {

    @Value("${registry.host}")
    private String registryHost;

    @Value("${registry.port}")
    private String registryPort;

    @Value("${registry.serviceName}")
    private String registryServiceName;

    @Value("${registry.apiPath.getRequestById}")
    private String getRequestByIdPath;

    @Value("${rmq.output.nexrad}")
    private String nexradQueue;

//    @Value("${rmq.output.mera}")
//    private String meraQueue;

    @Value("${rmq.output.userrequest}")
    private String userrequestQueue;

    private String baseUrl;

    private RestService restService;
    private RMQProducer rmqProducer;

    public DataService(RMQProducer rmqProducer, RestService restService) {
        this.rmqProducer = rmqProducer;
        this.restService = restService;
    }

    private String requestStatusUrl;

    @PostConstruct
    public void constructBaseUrl() {
        log.info("{}", registryServiceName + "_SERVICE_HOST");
        log.info("{}", registryServiceName + "_SERVICE_PORT");
        String kubernetesIp = System.getenv(registryServiceName + "_SERVICE_HOST");
        String kubernetesPort = System.getenv(registryServiceName + "_SERVICE_PORT");
        log.info("kubernetesIp: {} and kubernetesPort: {}", kubernetesIp, kubernetesPort);
        if (kubernetesIp != null && kubernetesPort != null) {
            log.info("pointing to kube cluster");
            this.baseUrl = String.format("http://%s:%s", kubernetesIp, kubernetesPort);
        } else {
            log.info("pointing to local");
            this.baseUrl = String.format("http://%s:%s", registryHost, registryPort);
        }
        this.requestStatusUrl = this.baseUrl + this.getRequestByIdPath;
    }

    private String sendCreatePlotRequest(String userId, String datasource, Map<String, String> parameters) throws BaseException {
        String requestId = UUID.randomUUID().toString();
        String timestamp = String.valueOf(new Date().getTime());
        CreatePlotRequest createPlotRequest = CreatePlotRequest.builder().requestId(requestId).dataSource(datasource)
                                                               .status(0).parameters(parameters).userId(userId)
                                                               .timestamp(timestamp).build();
        CreatePlotRequestEvent registryEvent = CreatePlotRequestEvent.builder().id(requestId).source(Constants.SOURCE_GATEWAY)
                                                                     .time(timestamp)
                                                                     .type(Constants.INGESTOR_GET_DATA).data(createPlotRequest).build();
        rmqProducer.produceMessage(userrequestQueue, registryEvent);
        log.info("created request {} on registry", requestId);
        return requestId;
    }

    public String sendNexradPlotRequest(String userId, NexradRequest nexradRequest) throws BaseException {
        Map<String, String> parameters = new HashMap<>();
        parameters.put("day", nexradRequest.getDay());
        parameters.put("month", nexradRequest.getMonth());
        parameters.put("year", nexradRequest.getYear());
        parameters.put("radar", nexradRequest.getRadarStation());
        parameters.put("plotType", nexradRequest.getPlotType());
        String requestId = sendCreatePlotRequest(userId, "nexrad", parameters);
        String timestamp = String.valueOf(new Date().getTime());
        IngestorGetDataEvent ingestorEvent = IngestorGetDataEvent.builder().id(requestId).source(Constants.SOURCE_GATEWAY).time(timestamp)
                                                                 .type(Constants.INGESTOR_GET_DATA).data(nexradRequest).build();
        rmqProducer.produceMessage(nexradQueue, ingestorEvent);
        log.info("created nexrad request {} on ingestor", requestId);
        return requestId;
    }

    public PlotRequestResponse getRequestById(String id) throws BaseException {
        Map<String, String> requestParams = Collections.singletonMap("id", id);
        PlotRequestResponse responseBody = restService.makeRestCall(requestStatusUrl, null, PlotRequestResponse.class, requestParams,
                                                                    HttpMethod.GET);
        return responseBody;
    }

}
