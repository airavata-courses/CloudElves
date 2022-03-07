package com.cloudelves.forecast.registry.configuration;

import liquibase.integration.spring.SpringLiquibase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@Slf4j
public class PostgresConfig {

    @Value("${db.host}")
    private String dbHost;

    @Value("${db.port}")
    private String dbPort;

    @Value("${db.name}")
    private String dbName;

    @Value("${db.username}")
    private String dbUsername;

    @Value("${db.password}")
    private String dbPassword;


    @Bean
    public DataSource createPostgresDatasource() {
        String connectionUrl = getConnectionUrl();
        log.info("connectionUrl: {}", connectionUrl);
        log.info("dbUsername: {} and dbPassword: {}", dbUsername, dbPassword);
        return DataSourceBuilder.create().driverClassName("org.postgresql.Driver").url(connectionUrl).username(dbUsername)
                                .password(dbPassword).build();
    }

    private String getConnectionUrl() {
        return String.format("jdbc:postgresql://%s:%s/%s", dbHost, dbPort, dbName);
    }

    @Bean
    public SpringLiquibase createSpringLiquibase(DataSource dataSource) {
        SpringLiquibase springLiquibase = new SpringLiquibase();
        springLiquibase.setDataSource(dataSource);
        springLiquibase.setChangeLog("classpath:db/changelog/changelog-master.yml");
        return springLiquibase;
    }

}
