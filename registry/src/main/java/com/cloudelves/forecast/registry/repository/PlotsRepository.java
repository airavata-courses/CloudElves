package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.Plots;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlotsRepository extends CrudRepository<Plots, String> {

    @Query(value = "select * from plots a where a.id=:id", nativeQuery = true)
    Optional<Plots> findById(@Param("id") String userId);

}
