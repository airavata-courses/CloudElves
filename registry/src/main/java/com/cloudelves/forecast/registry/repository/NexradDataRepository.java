package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.NexradData;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface NexradDataRepository extends CrudRepository<NexradData, String> {

    @Query(nativeQuery = true, value = "select * from nexraddata where radar = :radarName and start_time <= :startTime and end_time >= :endTime")
    public List<NexradData> getDataInTimeRange(Timestamp startTime, Timestamp endTime, String radarName);


}
