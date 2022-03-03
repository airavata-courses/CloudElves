package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.events.LogEvent;
import com.cloudelves.forecast.gateway.model.registry.request.AppLogRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Date;

@Service
@Slf4j
public class LogService {

    @Autowired
    private RMQProducer rmqProducer;

    @Value("${rmq.output.registry}")
    private String registryQueue;

    public void logEvent(String id, String userId, String serviceId, String action, int status, String comments) {
        AppLogRequest logRequest = AppLogRequest.builder().serviceId(serviceId).userId(userId).action(action).status(status).id(id)
                                                .timestamp(String.valueOf(new Date().getTime())).comments(comments).build();
        LogEvent logEvent = LogEvent.builder().source(Constants.SOURCE_GATEWAY).datacontentType(Constants.DATA_CONTENT_TYPE).id(id)
                                    .type(Constants.REGISTRY_APPLOG).time(String.valueOf(new Date().getTime())).data(logRequest).build();
        String timestamp = String.format("%d", new Date().getTime());
        try {
            rmqProducer.produceMessage(registryQueue, logEvent);
        } catch (BaseException e) {
            log.error("error while logging event: ", e);
        }
    }

}
