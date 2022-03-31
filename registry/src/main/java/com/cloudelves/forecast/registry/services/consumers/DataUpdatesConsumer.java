package com.cloudelves.forecast.registry.services.consumers;

import com.cloudelves.forecast.registry.dao.MeraData;
import com.cloudelves.forecast.registry.dao.NexradData;
import com.cloudelves.forecast.registry.model.events.IngestorMeraDataResponseEvent;
import com.cloudelves.forecast.registry.model.events.IngestorNexradDataResponseEvent;
import com.cloudelves.forecast.registry.model.response.IngestorMeraDataResponse;
import com.cloudelves.forecast.registry.model.response.IngestorNexradDataResponse;
import com.cloudelves.forecast.registry.repository.MeraDataRepository;
import com.cloudelves.forecast.registry.repository.NexradDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
@DependsOn({"RMQService"})
@Slf4j
public class DataUpdatesConsumer {

    private MeraDataRepository meraDataRepository;
    private NexradDataRepository nexradDataRepository;

    public DataUpdatesConsumer(NexradDataRepository nexradDataRepository, MeraDataRepository meraDataRepository) {
        this.nexradDataRepository = nexradDataRepository;
        this.meraDataRepository = meraDataRepository;
    }

    @RabbitListener(queues = "${rmq.input.mera}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void meraDataUpdatesConsumer(IngestorMeraDataResponseEvent meraDataResponseEvent) {
        List<IngestorMeraDataResponse> meraDataResponseList = meraDataResponseEvent.getData();
        for(IngestorMeraDataResponse meraDataResponse: meraDataResponseList) {
            Timestamp timestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(meraDataResponse.getExpirationTime())));
            Timestamp currentTime = Timestamp.from(Instant.now());

            MeraData meraData = MeraData.builder().meraDataId(meraDataResponse.getDataId()).date(meraDataResponse.getDate())
                                        .dataS3Key(meraDataResponse.getDataS3Key()).expirationTime(timestamp)
                                        .lastAccessTime(currentTime).variable(meraDataResponse.getVariable())
                                        .status(meraDataResponse.getStatus()).build();
            meraDataRepository.save(meraData);
            log.info("successfully updated mera data with id: {}", meraData.getMeraDataId());
        }
    }

    @RabbitListener(queues = "${rmq.input.nexrad}", concurrency = "${rmq.consumerCount}", containerFactory = "customConnFactory")
    public void nexradDataUpdatesConsumer(IngestorNexradDataResponseEvent nexradDataResponseEvent) {
        IngestorNexradDataResponse nexradDataResponse = nexradDataResponseEvent.getData();

        Timestamp expirationTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(nexradDataResponse.getExpirationTime())));
        Timestamp startTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(nexradDataResponse.getStartTime())));
        Timestamp endTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(nexradDataResponse.getEndTime())));
        Timestamp currentTime = Timestamp.from(Instant.now());

        NexradData nexradData = NexradData.builder().nexradDataId(nexradDataResponse.getDataId()).startTime(startTime).endTime(endTime)
                                          .dataS3Key(nexradDataResponse.getDataS3Key()).expirationTime(expirationTime)
                                          .lastAccessTime(currentTime).radarName(nexradDataResponse.getRadarName())
                                          .status(nexradDataResponse.getStatus()).build();
        nexradDataRepository.save(nexradData);
        log.info("successfully updated nexrad data with id: {}", nexradData.getNexradDataId());
    }

}
