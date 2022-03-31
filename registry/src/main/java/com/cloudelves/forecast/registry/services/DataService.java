package com.cloudelves.forecast.registry.services;

import com.cloudelves.forecast.registry.constants.DataServiceConstants;
import com.cloudelves.forecast.registry.dao.MeraData;
import com.cloudelves.forecast.registry.dao.NexradData;
import com.cloudelves.forecast.registry.model.response.MeraDataResponse;
import com.cloudelves.forecast.registry.repository.MeraDataRepository;
import com.cloudelves.forecast.registry.repository.NexradDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
}
