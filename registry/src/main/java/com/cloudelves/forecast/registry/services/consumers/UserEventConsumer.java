package com.cloudelves.forecast.registry.services.consumers;

import com.cloudelves.forecast.registry.dao.UserDetail;
import com.cloudelves.forecast.registry.dao.UserEvent;
import com.cloudelves.forecast.registry.model.request.UserEventLogRequest;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import com.cloudelves.forecast.registry.model.events.ErrorEvent;
import com.cloudelves.forecast.registry.model.events.UserEventLogEvent;
import com.cloudelves.forecast.registry.repository.UserDetailRepository;
import com.cloudelves.forecast.registry.repository.UserEventRepository;
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
public class UserEventConsumer {

    private UserDetailRepository userDetailRepository;
    private UserEventRepository userEventRepository;
    private RMQService rmqService;

    public UserEventConsumer(UserDetailRepository userDetailRepository, UserEventRepository userEventRepository, RMQService rmqService) {
        this.userDetailRepository = userDetailRepository;
        this.userEventRepository = userEventRepository;
        this.rmqService = rmqService;
    }

    @RabbitListener(queues = "${rmq.input.eventlog}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void eventLogReceiver(UserEventLogEvent eventLogEvent) {
        UserEventLogRequest eventLog = eventLogEvent.getData();
        try {
            Optional<UserDetail> userDetailsOpt = userDetailRepository.findById(eventLog.getUserId());
            if (userDetailsOpt.isEmpty()) {
                String errorMessage = String.format("user details not found: %s", eventLog.getUserId());
                DefaultError error = DefaultError.builder().error(errorMessage).statusCode(HttpStatus.BAD_REQUEST.toString()).build();
                rmqService.sendToDeadLetter(new ErrorEvent(error));
                log.error("error while persisting log: {}", errorMessage);
            } else {
                Timestamp timestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(eventLog.getEventTimestamp())));
                UserEvent userEvent = UserEvent.builder().eventId(eventLog.getId()).eventName(eventLog.getEventName())
                                               .eventTimestamp(timestamp).userDetails(userDetailsOpt.get()).build();
                userEventRepository.save(userEvent);
                log.info("successfully persisted logs for user: {}", eventLog.getUserId());
            }
        } catch (Exception e) {
            log.error("error while persisting log: ", e);
            DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString())
                                             .build();
            rmqService.sendToDeadLetter(new ErrorEvent(error));
        }
    }


}
