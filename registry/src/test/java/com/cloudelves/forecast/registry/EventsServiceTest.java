package com.cloudelves.forecast.registry;

import com.cloudelves.forecast.registry.exceptions.DataServiceException;
import com.cloudelves.forecast.registry.exceptions.EventsServiceException;
import com.cloudelves.forecast.registry.model.response.IngestorMeraDataResponse;
import com.cloudelves.forecast.registry.model.response.IngestorNexradDataResponse;
import com.cloudelves.forecast.registry.services.DataService;
import com.cloudelves.forecast.registry.services.EventsService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = RegistryApplication.class)
@TestPropertySource(locations = "classpath:application.yml")
@Slf4j
public class EventsServiceTest {

    @Autowired
    EventsService eventsService;

    @Test
    public void getUserEventsTest() {
        try {
            Assert.assertTrue(eventsService.getUserEvents("userId", 10).size() <= 10);
        } catch (EventsServiceException e) {
            Assert.fail(e.getMessage());
        }
    }
    
}
