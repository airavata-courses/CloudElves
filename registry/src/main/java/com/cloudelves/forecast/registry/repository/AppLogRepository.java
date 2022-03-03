package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.AppLog;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppLogRepository extends CrudRepository<AppLog, String> {

    @Query(value = "select * from applog a where a.user_id=:userId", nativeQuery = true)
    List<AppLog> findByUserId(@Param("userId") String userId);

    @Query(value = "select * from applog a where a.user_id=:userId order by log_timestamp desc limit 20", nativeQuery = true)
    List<AppLog> findByUserIdLatest(@Param("userId") String userId);

    @Query(value = "select * from applog a where a.id=:id order by log_timestamp desc", nativeQuery = true)
    List<AppLog> findByTransactionId(@Param("id") String id);

}
