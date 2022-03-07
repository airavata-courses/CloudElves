package com.cloudelves.forecast.registry.services.consumers;

import com.cloudelves.forecast.registry.dao.AppLog;
import com.cloudelves.forecast.registry.dao.Plots;
import com.cloudelves.forecast.registry.dao.UserDetails;
import com.cloudelves.forecast.registry.model.request.AppLogRequest;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import com.cloudelves.forecast.registry.model.response.IngestorResponse;
import com.cloudelves.forecast.registry.model.rmq.AppLogEvent;
import com.cloudelves.forecast.registry.model.rmq.IngestorResponseEvent;
import com.cloudelves.forecast.registry.repository.AppLogRepository;
import com.cloudelves.forecast.registry.repository.PlotsRepository;
import com.cloudelves.forecast.registry.repository.UserDetailsRepository;
import liquibase.logging.LogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
@Slf4j
public class AppLogConsumer {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private AppLogRepository appLogRepository;

    @Autowired
    private PlotsRepository plotsRepository;


    @RabbitListener(queues = "${rmq.input.applog}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void appLogReceiver(AppLogEvent appLogEvent) {
        AppLogRequest appLogRequest = appLogEvent.getData();
        try {
            Optional<UserDetails> userDetailsOpt = userDetailsRepository.findById(appLogRequest.getUserId());
            if (userDetailsOpt.isEmpty()) {
                String errorMessage = "invalid user";
                DefaultError error = DefaultError.builder().error(errorMessage).statusCode(HttpStatus.BAD_REQUEST.toString()).build();
                log.error("error while persisting log: {}", errorMessage);
            } else {
                Timestamp timestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(appLogRequest.getTimestamp())));
                AppLog appLog = new AppLog(appLogRequest.getId(), userDetailsOpt.get(), appLogRequest.getServiceId(),
                                           appLogRequest.getAction(), timestamp, appLogRequest.getStatus(), appLogRequest.getComments());
                appLogRepository.save(appLog);
                log.info("successfully persisted logs");
            }
        } catch (Exception e) {
            log.error("error while persisting log: ", e);
            DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                             .build();
        }
    }

    @RabbitListener(queues = "${rmq.input.ingestor}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void ingestorReceiver(IngestorResponseEvent ingestorResponseEvent) {
        IngestorResponse ingestorResponse = ingestorResponseEvent.getData();
        Timestamp timestamp = Timestamp.from(Instant.ofEpochMilli(new Date().getTime()));
        try {
            Plots plot = new Plots(ingestorResponse.getId(), ingestorResponse.getImage());
            plotsRepository.save(plot);
            Optional<UserDetails> userDetailsOpt = userDetailsRepository.findById(ingestorResponse.getUserId());
            if (userDetailsOpt.isPresent()) {
                AppLog appLog = AppLog.builder().logTimestamp(timestamp).action(ingestorResponse.getAction())
                                      .comments(ingestorResponse.getComments()).id(ingestorResponse.getId()).serviceId("ingestor")
                                      .user(userDetailsOpt.get()).status(ingestorResponse.getStatus()).build();
                appLogRepository.save(appLog);
            } else {
                AppLog appLog = AppLog.builder().logTimestamp(timestamp).action(ingestorResponse.getAction())
                                      .comments("invalid user").id(ingestorResponse.getId()).serviceId("ingestor")
                                      .user(userDetailsOpt.get()).status(-1).build();
                appLogRepository.save(appLog);
            }
        } catch (Exception e) {
            log.error("error while persisting log: ", e);
            DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                             .build();
            AppLog appLog = AppLog.builder().logTimestamp(timestamp).action(ingestorResponse.getAction())
                                  .comments(e.getMessage()).id(ingestorResponse.getId()).serviceId("ingestor").status(-1).build();
            appLogRepository.save(appLog);
        }
    }

}
