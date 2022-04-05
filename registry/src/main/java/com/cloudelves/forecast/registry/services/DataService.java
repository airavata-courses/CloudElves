package com.cloudelves.forecast.registry.services;

import com.cloudelves.forecast.registry.constants.DataServiceConstants;
import com.cloudelves.forecast.registry.dao.MeraData;
import com.cloudelves.forecast.registry.dao.NexradData;
import com.cloudelves.forecast.registry.exceptions.DataServiceException;
import com.cloudelves.forecast.registry.model.response.IngestorMeraDataResponse;
import com.cloudelves.forecast.registry.model.response.IngestorNexradDataResponse;
import com.cloudelves.forecast.registry.model.response.MeraDataResponse;
import com.cloudelves.forecast.registry.repository.MeraDataRepository;
import com.cloudelves.forecast.registry.repository.NexradDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
@Slf4j
public class DataService {

    private NexradDataRepository nexradDataRepository;
    private MeraDataRepository meraDataRepository;

    public DataService(NexradDataRepository nexradDataRepository, MeraDataRepository meraDataRepository) {
        this.nexradDataRepository = nexradDataRepository;
        this.meraDataRepository = meraDataRepository;
    }


    public MeraDataResponse getMeraData(List<String> dates, String variable) {
        Map<String, MeraData> completedMap = new HashMap<>();
        Map<String, MeraData> inprogessMap = new HashMap<>();
        List<String> unavailable = new ArrayList<>();

        Timestamp currentTimestamp = Timestamp.from(Instant.now());
        for (String date : dates) {
            List<MeraData> meraDataList = meraDataRepository.findByVariableAndDate1(date, variable);
            MeraData result = null;
            MeraData inProgess = null;
            for (MeraData meraData : meraDataList) {
                switch (meraData.getStatus()) {
                    case DataServiceConstants.COMPLETE:
                        if (result == null) {
                            result = meraData;
                        } else {
                            result = meraData.getLastAccessTime().after(result.getLastAccessTime()) ? meraData : result;
                        }
                        break;
                    case DataServiceConstants.CREATED:
                    case DataServiceConstants.INPROGRESS:
                        if (meraData.getExpirationTime().after(currentTimestamp)) {
                            if (inProgess == null) {
                                inProgess = meraData;
                            } else {
                                inProgess = meraData.getLastAccessTime().after(inProgess.getLastAccessTime()) ? meraData : inProgess;
                            }
                        }
                        break;
                }
            }
            if (result != null) {
                completedMap.put(date, result);
            } else if (inProgess != null) {
                inprogessMap.put(date, inProgess);
            } else {
                unavailable.add(date);
            }
        }
        return MeraDataResponse.builder().completed(completedMap).inProgress(inprogessMap).unavailable(unavailable).build();
    }

    public List<MeraData> getAllMeraData() {
        List<MeraData> meraDataList = new ArrayList<>();
        meraDataRepository.findAll().forEach(meraDataList::add);
        return meraDataList;
    }

    public List<NexradData> getAllNexradData() {
        List<NexradData> nexradDataList = new ArrayList<>();
        nexradDataRepository.findAll().forEach(nexradDataList::add);
        return nexradDataList;
    }

    public NexradData getNexradData(String startTime, String endTime, String radarName) {
        Timestamp startTimestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(startTime)));
        Timestamp endTimestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(endTime)));

        List<NexradData> nexradDataList = nexradDataRepository.getDataInTimeRange(startTimestamp, endTimestamp, radarName);

        Timestamp currentTimestamp = Timestamp.from(Instant.now());

        NexradData result = null;
        NexradData inProgess = null;

        for (NexradData nexradData : nexradDataList) {
            switch (nexradData.getStatus()) {
                case DataServiceConstants.COMPLETE:
                    if (result == null) {
                        result = nexradData;
                    } else {
                        result = nexradData.getLastAccessTime().after(result.getLastAccessTime()) ? nexradData : result;
                    }
                    break;
                case DataServiceConstants.CREATED:
                case DataServiceConstants.INPROGRESS:
                    if (nexradData.getExpirationTime().after(currentTimestamp)) {
                        if (inProgess == null) {
                            inProgess = nexradData;
                        } else {
                            inProgess = nexradData.getLastAccessTime().after(inProgess.getLastAccessTime()) ? nexradData : inProgess;
                        }
                    }
                    break;
            }
        }

        if (result != null) {
            log.info("nexrad data exists");
            return result;
        } else if (inProgess != null) {
            log.info("nexrad data download in progress");
            return inProgess;
        } else {
            log.info("nexrad data either does not exists or in progress has expired");
            return null;
        }
    }

    public void updateMeraData(IngestorMeraDataResponse meraDataResponse) throws DataServiceException {
        try {
            Optional<MeraData> meraDataOpt = meraDataRepository.findById(meraDataResponse.getDataId());
            MeraData meraData;
            Timestamp currentTime = Timestamp.from(Instant.now());
            if (meraDataOpt.isPresent()) {
                meraData = meraDataOpt.get();
                meraData.setDataS3Key(meraDataResponse.getDataS3Key());
                meraData.setLastAccessTime(currentTime);
                meraData.setStatus(meraDataResponse.getStatus());
                meraData.setLastAccessTime(currentTime);
            } else {
                Timestamp expirationTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(meraDataResponse.getExpirationTime())));
                meraData = MeraData.builder().meraDataId(meraDataResponse.getDataId()).dataS3Key(meraDataResponse.getDataS3Key())
                                   .date(meraDataResponse.getDate()).status(meraDataResponse.getStatus())
                                   .variable(meraDataResponse.getVariable()).lastAccessTime(currentTime).expirationTime(expirationTime)
                                   .build();
            }
            meraDataRepository.save(meraData);
            log.info("successfully updated nexrad data with id: {}", meraData.getMeraDataId());
        } catch (Exception e) {
            String errorMessage = String.format("error while updating mera data with id: %s: %s", meraDataResponse.getDataId(),
                                                e.getMessage());
            log.error(errorMessage, e);
            throw new DataServiceException(errorMessage);
        }
    }

    public void updateNexradService(IngestorNexradDataResponse nexradDataResponse) throws DataServiceException {
        try {
            Optional<NexradData> nexradDataOpt = nexradDataRepository.findById(nexradDataResponse.getDataId());
            NexradData nexradData;
            Timestamp startTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(nexradDataResponse.getStartTime())));
            Timestamp endTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(nexradDataResponse.getEndTime())));
            Timestamp currentTime = Timestamp.from(Instant.now());
            if (nexradDataOpt.isPresent()) {
                nexradData = nexradDataOpt.get();
                nexradData.setDataS3Key(nexradDataResponse.getDataS3Key());
                nexradData.setLastAccessTime(currentTime);
                nexradData.setStatus(nexradDataResponse.getStatus());
            } else {
                Timestamp expirationTime = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(nexradDataResponse.getExpirationTime())));
                nexradData = NexradData.builder().nexradDataId(nexradDataResponse.getDataId()).startTime(startTime).endTime(endTime)
                                       .dataS3Key(nexradDataResponse.getDataS3Key()).expirationTime(expirationTime)
                                       .lastAccessTime(currentTime).radarName(nexradDataResponse.getRadarName())
                                       .status(nexradDataResponse.getStatus()).build();
            }
            nexradDataRepository.save(nexradData);
            log.info("successfully updated nexrad data with id: {}", nexradData.getNexradDataId());
        } catch (Exception e) {
            String errorMessage = String.format("error while updating nexrad data with id: %s: %s", nexradDataResponse.getDataId(),
                                                e.getMessage());
            log.error(errorMessage, e);
            throw new DataServiceException(errorMessage);
        }
    }
}

