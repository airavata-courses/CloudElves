package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.UserRequests;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRequestsRepository extends CrudRepository<UserRequests, String> {

    @Query(nativeQuery = true, value = "select * from requests r where r.user_id=:userId order by r.request_timestamp desc")
    public List<UserRequests> findByUserId(String userId);

}
