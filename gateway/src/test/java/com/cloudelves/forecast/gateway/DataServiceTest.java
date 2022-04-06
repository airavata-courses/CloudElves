package com.cloudelves.forecast.gateway;

import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.ingestor.request.MeraRequest;
import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import com.cloudelves.forecast.gateway.services.DataService;
import com.cloudelves.forecast.gateway.services.IngestorService;
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
public class DataServiceTest {

    @Autowired
    DataService dataService;

    @Test
    public void sendNexradCreatePlotRequestTest() {
        try {
            NexradRequest nexradRequest = NexradRequest.builder().day("10").month("10").radarStation("KABR").year("2021")
                                                       .plotType("reflectivity").build();
            dataService.sendNexradPlotRequest("madhkr", nexradRequest);
        } catch (BaseException e) {
            log.error("error while sending request: {}", e.getMessage());
            Assert.fail();
        }
    }

    @Test
    public void sendMeraCreatePlotRequestTest() {
        try {
            MeraRequest meraRequest = MeraRequest.builder().endDate("2022-01-01").startDate("2022-01-02").outputType("image").product("M2T1NXSLV_5.12.4").varNames(
                    Collections.singletonList("T10M")).build();
            dataService.sendMeraPlotRequest("madhkr", meraRequest);
        } catch (BaseException e) {
            log.error("error while sending request: {}", e.getMessage());
            Assert.fail();
        }
    }

    @Test
    public void getRequestPositiveTest() {
        String id = "3bbcaafb-133e-4070-b122-f02819567ffe";
        try {
            dataService.getRequestById(id);
        } catch (BaseException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void getRequestNegativeTest() {
        String id = "dummy-id";
        try {
            dataService.getRequestById(id);
            Assert.fail("this request must not have succeeded");
        } catch (BaseException e) {
            Assert.assertTrue(true);
        }
    }

}
