package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.UserEvent;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEventRepository extends CrudRepository<UserEvent, String> {

    @Query(nativeQuery = true, value = "select * from usereventlog u where u.user_id=:userId order by u.event_timestamp desc limit :numItems")
    List<UserEvent> findLatestEventsByUserId(@Param("userId") String userId, @Param("numItems") int numItems);

}
