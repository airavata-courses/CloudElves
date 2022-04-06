package com.cloudelves.forecast.registry;

import com.cloudelves.forecast.registry.exceptions.UserRequestsServicesException;
import com.cloudelves.forecast.registry.services.UserRequestsService;
import com.cloudelves.forecast.registry.services.UserServices;
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
public class UserServiceTest {

    @Autowired
    UserServices userService;

    @Test
    public void getUserDetailsPositiveTest() {
        try {
            userService.getUserDetails("madhkr");
            Assert.assertTrue(true);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void getUserDetailsNegativeTest() {
        try {
            userService.getUserDetails("dummy-user");
            Assert.fail("this user must not exist");
        } catch (Exception e) {
            Assert.assertTrue(true);
        }
    }
    
}
