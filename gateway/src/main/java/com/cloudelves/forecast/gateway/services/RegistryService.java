package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.registry.response.AppLogResponse;
import com.cloudelves.forecast.gateway.model.registry.response.PlotsResponse;
import com.cloudelves.forecast.gateway.model.response.GetDataStatusResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.Map;

@Service
@Slf4j
public class RegistryService {

    @Value("${registry.host}")
    private String registryHost;

    @Value("${registry.port}")
    private String registryPort;

    @Value("${registry.serviceName}")
    private String registryServiceName;

    @Value("${registry.apiPath.getLogById}")
    private String getLogByIdPath;

    @Value("${registry.apiPath.getPlot}")
    private String getPlotPath;

    private String baseUrl, getLogByIdUrl, getPlotUrl;

    @Autowired
    private RestService restService;

    @PostConstruct
    public void constructBaseUrl() {
//        Map<String, String> env = System.getenv();
//        for(String key: env.keySet()) {
//            log.info("{}: {}", key, env.get(key));
//        }
        log.info("{}", registryServiceName+"_SERVICE_HOST");
        log.info("{}", registryServiceName+"_SERVICE_PORT");
        String kubernetesIp = System.getenv(registryServiceName+"_SERVICE_HOST");
        String kubernetesPort = System.getenv(registryServiceName+"_SERVICE_PORT");
        log.info("kubernetesIp: {} and kubernetesPort: {}", kubernetesIp, kubernetesPort);
        if(kubernetesIp != null && kubernetesPort!=null) {
            log.info("pointing to kube cluster");
            this.baseUrl = String.format("http://%s:%s", kubernetesIp, kubernetesPort);
        } else {
            log.info("pointing to local");
            this.baseUrl = String.format("http://%s:%s", registryHost, registryPort);
        }
        this.getLogByIdUrl = this.baseUrl + this.getLogByIdPath;
        this.getPlotUrl = this.baseUrl + this.getPlotPath;
    }

    public GetDataStatusResponse getDataStatusResponse(String id) {
        try {
            AppLogResponse[] appLogResponses = restService.makeRestCall(getLogByIdUrl, null, AppLogResponse[].class,
                                                                        Collections.singletonMap("id", id), HttpMethod.GET);
            int status = Constants.STATUS_CREATED;
            String comments = "";
            for (AppLogResponse appLogResponse : appLogResponses) {
                if (appLogResponse.getServiceId().contains(Constants.COMPONENT_INGESTOR)) {
                    if (appLogResponse.getStatus() == Constants.STATUS_SUCCESS || appLogResponse.getStatus() == Constants.STATUS_FAILED) {
                        status = appLogResponse.getStatus();
                        comments = appLogResponse.getComments();
                        break;
                    }
                }
            }

            switch (status) {
                case Constants.STATUS_CREATED:
                    return GetDataStatusResponse.builder().status(Constants.STATUS_CREATED).id(id).build();
                case Constants.STATUS_SUCCESS:
                    PlotsResponse plotsResponse = restService.makeRestCall(getPlotUrl, null, PlotsResponse.class,
                                                                           Collections.singletonMap("id", id), HttpMethod.GET);
                    return GetDataStatusResponse.builder().status(Constants.STATUS_SUCCESS).id(id).image(plotsResponse.getImage()).build();
                case Constants.STATUS_FAILED:
                    return GetDataStatusResponse.builder().status(Constants.STATUS_FAILED).id(id).error(comments).build();
                default:
                    return GetDataStatusResponse.builder().status(Constants.STATUS_ERROR).id(id).error("unknown status").build();
            }

        } catch (BaseException e) {
            return GetDataStatusResponse.builder().status(Constants.STATUS_ERROR).error(e.getMessage()).id(id).build();
        }
    }

}
