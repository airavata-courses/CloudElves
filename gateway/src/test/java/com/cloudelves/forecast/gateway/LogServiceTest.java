package com.cloudelves.forecast.gateway;

import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.ingestor.request.MeraRequest;
import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import com.cloudelves.forecast.gateway.services.DataService;
import com.cloudelves.forecast.gateway.services.LogService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Collections;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = GatewayApplication.class)
@TestPropertySource(locations = "classpath:application.yml")
@Slf4j
public class LogServiceTest {

    @Autowired
    LogService logService;

    @Test
    public void sendLogEvent() {
        try {
            String id = "sample-log-id";
            logService.logEvent(id, "madhkr", "sample-event-name");
        } catch (Exception e) {
            log.error("error while sending request: {}", e.getMessage());
            Assert.fail();
        }
    }

}
