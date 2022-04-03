package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.exception.BaseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RMQProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rmq.exchange}")
    private String exchange;

    public <T> void produceMessage(String queue, T message) throws BaseException {
        try {
            rabbitTemplate.convertAndSend(exchange, queue, message);
            log.info("successfully sent message to {}", queue);
        } catch (AmqpException e){
            String errorMessage = String.format("error while sending message to %s: %s", queue, e.getMessage());
            log.error(errorMessage);
            throw new BaseException(errorMessage);
        }
    }
}
