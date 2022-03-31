package com.cloudelves.forecast.registry.dao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "meradata")
public class MeraData {

    @Id
    @Column(name = "mera_data_id")
    private String meraDataId;

    @Column(name = "date1")
    private String date;

    @Column(name = "variable")
    private String variable;

    @Column(name = "status")
    private int status;

    @Column(name = "expiration_time")
    private Timestamp expirationTime;

    @Column(name = "last_access_time")
    private Timestamp lastAccessTime;

    @Column(name = "data_s3_key")
    private String dataS3Key;

}
