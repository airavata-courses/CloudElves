package com.cloudelves.forecast.gateway.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class RMQConfig {
    @Value("${rmq.host}")
    private String rmqHost;

    @Value("${rmq.port}")
    private String rmqPort;

    @Value("${rmq.username}")
    private String rmqUsername;

    @Value("${rmq.password}")
    private String rmqPassword;

    @Value("${rmq.serviceName}")
    private String rmqServiceName;

    @Bean
    public SimpleMessageListenerContainer createContainer(CachingConnectionFactory connectionFactory) {
        return new SimpleMessageListenerContainer(connectionFactory);
    }

    @Bean
    public CachingConnectionFactory createRmqConnection() {
        String curRmqHost, curRmqPort;
        if(rmqServiceName.equalsIgnoreCase("local")) {
            log.info("pointing to rmq on local");
            curRmqHost = this.rmqHost;
            curRmqPort = this.rmqPort;
        } else {
            log.info("pointing to rmq on kubernetes");
            curRmqHost = System.getenv(rmqServiceName + "_SERVICE_HOST") == null ? this.rmqHost : System.getenv(
                    rmqServiceName + "_SERVICE_HOST");
            curRmqPort = System.getenv(rmqServiceName + "_SERVICE_PORT") == null ? this.rmqPort : System.getenv(
                    rmqServiceName + "_SERVICE_PORT");
        }
        log.info("rmqHost: {}, rmqPort: {}", curRmqHost, curRmqPort);
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost(curRmqHost);
        connectionFactory.setPort(Integer.parseInt(curRmqPort));
        connectionFactory.setUsername(rmqUsername);
        connectionFactory.setPassword(rmqPassword);
        return connectionFactory;
    }

    @Bean
    public RabbitTemplate createRabbitTemplate(CachingConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate();
        rabbitTemplate.setConnectionFactory(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        return rabbitTemplate;
    }

    @Bean(name = "customConnFactory")
    public SimpleRabbitListenerContainerFactory sample(CachingConnectionFactory connectionFactory, MessageConverter messageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        return factory;
    }

    @Bean
    public RabbitAdmin createAmqpAdmin(CachingConnectionFactory connectionFactory) {
        RabbitAdmin amqpAdmin = new RabbitAdmin(connectionFactory);
        return amqpAdmin;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean(name = "ingestorQueue")
    public Queue createNexradQueue(@Value("${rmq.output.nexrad}") String nexradQueue) {
        return new Queue(nexradQueue, true);
    }

    @Bean(name = "meraQueue")
    public Queue createMeraQueue(@Value("${rmq.output.mera}") String meraQueue) {
        return new Queue(meraQueue, true);
    }

    @Bean(name = "exchange")
    public DirectExchange createDirectExchange(@Value("${rmq.exchange}") String registryExchange) {
        return new DirectExchange(registryExchange);
    }

    @Bean(name = "appLogQueueBinding")
    public Binding createAppLogBinding(DirectExchange directExchange, @Qualifier("ingestorQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(directExchange).with(queue.getName());
    }

    @Bean(name = "meraQueueBinding")
    public Binding createMeraQueueBinding(DirectExchange directExchange, @Qualifier("meraQueue") Queue queue) {
        return BindingBuilder.bind(queue).to(directExchange).with(queue.getName());
    }
}
