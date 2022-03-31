package com.cloudelves.forecast.registry.repository;

import com.cloudelves.forecast.registry.dao.MeraData;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeraDataRepository extends CrudRepository<MeraData, String> {

    @Query(nativeQuery = true, value = "select * from meradata where date1 = :date and variable = :variable")
    public List<MeraData> findByVariableAndDate1(String date, String variable);

}
