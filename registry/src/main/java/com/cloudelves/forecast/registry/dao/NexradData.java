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
@Table(name = "nexraddata")
public class NexradData {

    @Id
    @Column(name = "nexrad_data_id")
    private String nexradDataId;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column(name = "radar")
    private String radarName;

    @Column(name = "status")
    private int status;

    @Column(name = "expiration_time")
    private Timestamp expirationTime;

    @Column(name = "last_access_time")
    private Timestamp lastAccessTime;

    @Column(name = "data_s3_key")
    private String dataS3Key;

}
