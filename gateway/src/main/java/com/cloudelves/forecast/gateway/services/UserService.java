package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.model.registry.request.UserDetailsRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Date;

@Slf4j
@Service
public class UserService {

    @Value("${registry.host}")
    private String registryHost;

    @Value("${registry.port}")
    private String registryPort;

    @Value("${registry.serviceName}")
    private String registryServiceName;

    private String baseUrl;

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

    @Value("${registry.apiPath.addUser}")
    private String addUserPath;

    @Autowired
    private LogService logService;

    @Autowired
    private RestService restService;

    public void checkAndAddUser(String id, String userId, String username, String email) {
        String url = baseUrl + addUserPath;
        String timestamp = String.format("%d", new Date().getTime());
        UserDetailsRequest requestBody = UserDetailsRequest.builder().userId(userId).userEmail(email).name(username).timestamp(timestamp)
                                                           .build();
        try {
            restService.makeRestCall(url, requestBody, String.class, null, HttpMethod.POST);
            logService.logEvent(id, userId, "registry", "addUser", 0, "successfully added user");
        } catch (Exception e) {
            if (!e.getMessage().contains("user already registered")) {
                log.error("error while registering user: ", e);
                logService.logEvent(id, userId, "registry", "addUser", 1, e.getMessage());
            }
        }
    }

}
