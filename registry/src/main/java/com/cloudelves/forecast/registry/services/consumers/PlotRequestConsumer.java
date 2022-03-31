package com.cloudelves.forecast.registry.services.consumers;

import com.cloudelves.forecast.registry.dao.UserDetail;
import com.cloudelves.forecast.registry.dao.UserRequests;
import com.cloudelves.forecast.registry.model.events.CreatePlotRequestEvent;
import com.cloudelves.forecast.registry.model.events.ErrorEvent;
import com.cloudelves.forecast.registry.model.events.IngestorResponseEvent;
import com.cloudelves.forecast.registry.model.request.CreatePlotRequest;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import com.cloudelves.forecast.registry.model.response.IngestorResponse;
import com.cloudelves.forecast.registry.repository.UserDetailRepository;
import com.cloudelves.forecast.registry.repository.UserRequestsRepository;
import liquibase.pro.packaged.P;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.DependsOn;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Component
@DependsOn({"RMQService"})
@Slf4j
public class PlotRequestConsumer {

    private UserRequestsRepository userRequestsRepository;
    private UserDetailRepository userDetailRepository;
    private RMQService rmqService;

    public PlotRequestConsumer(UserRequestsRepository userRequestsRepository, UserDetailRepository userDetailRepository,
                               RMQService rmqService) {
        this.userRequestsRepository = userRequestsRepository;
        this.userDetailRepository = userDetailRepository;
        this.rmqService = rmqService;
    }

    @RabbitListener(queues = "${rmq.input.ingestor}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void ingestorRequestUpdateReceiver(IngestorResponseEvent ingestorResponseEvent) {
        IngestorResponse ingestorResponse = ingestorResponseEvent.getData();
        try {
            Optional<UserRequests> requestOpt = userRequestsRepository.findById(ingestorResponse.getRequestId());
            if (requestOpt.isEmpty()) {
                String errorMessage = String.format("request details not found: %s", ingestorResponse.getRequestId());
                DefaultError error = DefaultError.builder().error(errorMessage).statusCode(HttpStatus.BAD_REQUEST.toString()).build();
                rmqService.sendToDeadLetter(new ErrorEvent(error));
                log.error("error while updating request details: {}", errorMessage);
            } else {
                UserRequests request = requestOpt.get();
                request.setComments(ingestorResponse.getComments());
                request.setStatus(ingestorResponse.getStatus());
                if (ingestorResponse.getStatus() == 2) {
                    request.setResultS3Key(ingestorResponse.getResultS3Key());
                }
                userRequestsRepository.save(request);
                log.info("successfully updated result for request id {}", ingestorResponse.getRequestId());
            }
        } catch (Exception e) {
            log.error("error while updating request details: ", e);
            DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                             .build();
            rmqService.sendToDeadLetter(new ErrorEvent(error));
        }
    }

    @RabbitListener(queues = "${rmq.input.userrequest}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void gatewayCreateRequestConsumer(CreatePlotRequestEvent createPlotRequestEvent) {
        CreatePlotRequest createPlotRequest = createPlotRequestEvent.getData();
        Optional<UserRequests> userRequestsOpt;
        UserDetail userDetail;
        try {
            userRequestsOpt = userRequestsRepository.findById(createPlotRequest.getRequestId());
            userDetail = userDetailRepository.findById(createPlotRequest.getUserId()).get();
        } catch (Exception e) {
            String errorMessage = String.format("error while accessing database for request %s: %s", createPlotRequest.getRequestId(),
                                                e.getMessage());
            log.error(errorMessage);
            DefaultError error = DefaultError.builder().error(errorMessage).statusCode(HttpStatus.BAD_REQUEST.toString()).build();
            rmqService.sendToDeadLetter(new ErrorEvent(error));
            return;
        }

        if (userRequestsOpt.isPresent()) {
            String errorMessage = String.format("request id %s already exists", createPlotRequest.getRequestId());
            log.error(errorMessage);
            DefaultError error = DefaultError.builder().error(errorMessage).statusCode(HttpStatus.BAD_REQUEST.toString()).build();
            rmqService.sendToDeadLetter(new ErrorEvent(error));
        } else {
            Timestamp timestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(createPlotRequest.getTimestamp())));
            UserRequests userRequest = UserRequests.builder().requestId(createPlotRequest.getRequestId())
                                                   .dataSource(createPlotRequest.getDataSource())
                                                   .status(createPlotRequest.getStatus())
                                                   .parameters(createPlotRequest.stringifyParameters()).timestamp(timestamp)
                                                   .userDetails(userDetail).build();
            userRequestsRepository.save(userRequest);
            log.info("successfully created request with request id: {}", createPlotRequest.getRequestId());
        }
    }

}
