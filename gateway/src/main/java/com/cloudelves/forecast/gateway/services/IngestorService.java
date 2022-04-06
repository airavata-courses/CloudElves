package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.ingestor.response.ImageResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@Slf4j
public class IngestorService {

    @Value("${ingestor.host}")
    private String ingestorHost;

    @Value("${ingestor.port}")
    private String ingestorPort;

    @Value("${ingestor.serviceName}")
    private String ingestorServiceName;

    @Value("${ingestor.apiPath.getImage}")
    private String getImagePath;

    private String baseUrl, getImageUrl;

    private RestService restService;

    public IngestorService(RestService restService) {
        this.restService = restService;
    }

    @PostConstruct
    public void constructBaseUrl() {
        log.info("{}", ingestorServiceName + "_SERVICE_HOST");
        log.info("{}", ingestorServiceName + "_SERVICE_PORT");
        String kubernetesIp = System.getenv(ingestorServiceName + "_SERVICE_HOST");
        String kubernetesPort = System.getenv(ingestorServiceName + "_SERVICE_PORT");
        log.info("kubernetesIp: {} and kubernetesPort: {}", kubernetesIp, kubernetesPort);
        if (kubernetesIp != null && kubernetesPort != null) {
            log.info("pointing to kube cluster");
            this.baseUrl = String.format("http://%s:%s", kubernetesIp, kubernetesPort);
        } else {
            this.baseUrl = String.format("http://%s:%s", ingestorHost, ingestorPort);
            log.info("pointing to local instance of ingestor at {}", this.baseUrl);
        }
        this.getImageUrl = this.baseUrl + this.getImagePath;
    }

    public ImageResponse getImage(String id) throws BaseException {
        String url = getImageUrl + "/" + id;
        ImageResponse imageResponse = restService.makeRestCall(url, null, ImageResponse.class, null, HttpMethod.GET);
        return imageResponse;
    }

}
