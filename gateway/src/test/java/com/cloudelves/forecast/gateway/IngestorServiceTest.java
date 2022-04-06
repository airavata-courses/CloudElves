package com.cloudelves.forecast.gateway;

import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.services.IngestorService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = GatewayApplication.class)
@TestPropertySource(locations = "classpath:application.yml")
@Slf4j
public class IngestorServiceTest {

    @Autowired
    IngestorService ingestorService;

    @Test
    public void validImageDownload() {
        String id = "3bbcaafb-133e-4070-b122-f02819567ffe";
        try {
            ingestorService.getImage(id);
            log.info("successfully queried image for id: {}", id);
        } catch (BaseException e) {
            Assert.fail();
        }
    }

    @Test
    public void invalidImageDownload() {
        String id = "dummy-id";
        try {
            ingestorService.getImage(id);
        } catch (BaseException e) {
            String expectedMessage = "error while downloading the file " + id;
            Assert.assertTrue(e.getMessage().contains(expectedMessage));
        }
    }

}
