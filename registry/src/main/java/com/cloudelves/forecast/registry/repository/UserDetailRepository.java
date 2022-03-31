package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.UserDetail;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends CrudRepository<UserDetail, String> {
}
