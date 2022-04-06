package com.cloudelves.forecast.registry;

import com.cloudelves.forecast.registry.exceptions.EventsServiceException;
import com.cloudelves.forecast.registry.exceptions.UserRequestsServicesException;
import com.cloudelves.forecast.registry.services.EventsService;
import com.cloudelves.forecast.registry.services.UserRequestsService;
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
public class UserRequestsServiceTest {

    @Autowired
    UserRequestsService userRequestsService;

    @Test
    public void getUserEventsTest() {
        try {
            userRequestsService.getUserRequests("madhkr");
            Assert.assertTrue(true);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void getRequestByIdPositiveTest() {
        try {
            String requestId = "3bbcaafb-133e-4070-b122-f02819567ffe";
            userRequestsService.getRequestById(requestId);
            Assert.assertTrue(true);
        } catch (UserRequestsServicesException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void getRequestByIdNegativeTest() {
        try {
            String requestId = "dummy-id";
            userRequestsService.getRequestById(requestId);
            Assert.fail("this request should not have succeeded");
        } catch (UserRequestsServicesException e) {
            Assert.assertTrue(true);
        }
    }
    
}
