package com.cloudelves.forecast.gateway.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RMQConfig {
    @Value("${spring.rabbitmq.host}")
    private String rmqHost;

    @Value("${spring.rabbitmq.port}")
    private String rmqPort;

    @Value("${spring.rabbitmq.username}")
    private String rmqUsername;

    @Value("${spring.rabbitmq.password}")
    private String rmqPassword;

    @Bean
    public CachingConnectionFactory createRmqConnectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setAddresses(rmqHost + ":" + rmqPort);
        connectionFactory.setUsername(rmqUsername);
        connectionFactory.setPassword(rmqPassword);
        return connectionFactory;
    }

    @Bean
    public AmqpAdmin createAmqpAdmin(CachingConnectionFactory connectionFactory) {
        AmqpAdmin amqpAdmin = new RabbitAdmin(connectionFactory);
        return amqpAdmin;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean(name = "ingestorQueue")
    public Queue createUserDetailsQueue(@Value("${rmq.output.ingestor}") String getDataQueue) {
        return new Queue(getDataQueue, true);
    }

    @Bean(name = "exchange")
    public DirectExchange createDirectExchange(@Value("${rmq.exchange}") String registryExchange) {
        return new DirectExchange(registryExchange);
    }

    @Bean(name = "appLogQueueBinding")
    public Binding createAppLogBinding(DirectExchange directExchange, @Qualifier("ingestorQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(directExchange).with(queue.getName());
    }
}
