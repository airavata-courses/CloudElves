package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.AppLog;
import com.cloudelves.forecast.registry.dao.UserDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends CrudRepository<UserDetails, String> {
}
