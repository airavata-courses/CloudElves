package com.cloudelves.forecast.registry.services.consumers;

import com.cloudelves.forecast.registry.exceptions.BaseException;
import com.cloudelves.forecast.registry.model.events.ErrorEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class RMQService {

    @Value("${rmq.input.queues}")
    private String inputQueues;

    @Value("${rmq.deadletter}")
    private String deadletter;

    private AmqpAdmin amqpAdmin;
    private DirectExchange directExchange;
    private RabbitTemplate rabbitTemplate;

    public RMQService(AmqpAdmin amqpAdmin, @Qualifier("registryExchange") DirectExchange directExchange, RabbitTemplate rabbitTemplate) {
        this.amqpAdmin = amqpAdmin;
        this.directExchange = directExchange;
        this.rabbitTemplate = rabbitTemplate;
    }

    @PostConstruct
    public void createQueuesAndBindings() {
        List<String> queueList = new ArrayList<>(Arrays.asList(inputQueues.split(",")));
        queueList.add(deadletter);
        log.info("checking and creating the following queues: {}", inputQueues);
        for (String queueName : queueList) {
            queueName = queueName.trim();
            QueueInformation queueInfo = amqpAdmin.getQueueInfo(queueName);
            Queue queue = new Queue(queueName);
            amqpAdmin.declareQueue(queue);
            Binding queueBinding = BindingBuilder.bind(queue).to(directExchange).with(queueName);
            amqpAdmin.declareBinding(queueBinding);
            log.info("successfully created queue {} and bound to direct exchange {} with routing key: {}", queueName,
                     directExchange.getName(), queueName);
        }
    }

    public void sendToDeadLetter(ErrorEvent errorEvent) {
        try {
            produceMessage(deadletter, errorEvent);
            log.info("routed message to deadletter");
        } catch (BaseException e) {
            log.error("failed to send message to deadletter");
        }
    }

    public <T> void produceMessage(String queue, T message) throws BaseException {
        try {
            rabbitTemplate.convertAndSend(directExchange.getName(), queue, message);
            log.info("successfully sent message to {}", queue);
        } catch (AmqpException e){
            String errorMessage = String.format("error while sending message to {}: {}", queue, e.getMessage());
            log.error(errorMessage);
            throw new BaseException(errorMessage);
        }
    }

}
