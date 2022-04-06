package com.cloudelves.forecast.registry;

import com.cloudelves.forecast.registry.exceptions.DataServiceException;
import com.cloudelves.forecast.registry.model.response.IngestorMeraDataResponse;
import com.cloudelves.forecast.registry.model.response.IngestorNexradDataResponse;
import com.cloudelves.forecast.registry.services.DataService;
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
public class DataServiceTest {

    @Autowired
    DataService dataService;

    @Test
    public void updateMeraDataTest() {
        IngestorMeraDataResponse ingestorMeraDataResponse = IngestorMeraDataResponse.builder().dataId("sample-mera-data-id")
                                                                                    .dataS3Key("sample-mera-s3-key").date("2022-01-01")
                                                                                    .status(2).variable("T2M")
                                                                                    .expirationTime("1649234024000").build();
        try {
            dataService.updateMeraData(ingestorMeraDataResponse);
        } catch (DataServiceException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void updateNexradDataTest() {
        IngestorNexradDataResponse ingestorNexradDataResponse = IngestorNexradDataResponse.builder().dataId("sample-mera-data-id")
                                                                                          .dataS3Key("sample-mera-s3-key")
                                                                                          .startTime("1649234024000")
                                                                                          .status(2).endTime("1649234024000")
                                                                                          .radarName("KABR")
                                                                                          .expirationTime("1649234024000").build();
        try {
            dataService.updateNexradService(ingestorNexradDataResponse);
        } catch (DataServiceException e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void getAllNexradDataTest() {
        try {
            Assert.assertTrue(dataService.getAllNexradData().size() > 0);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void getAllMeraDataTest() {
        try {
            Assert.assertTrue(dataService.getAllMeraData().size() > 0);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

}
