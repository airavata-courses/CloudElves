package com.cloudelves.forecast.registry.dao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "requests")
public class UserRequests {

    @Id
    @Column(name = "request_id")
    private String requestId;

    @Column(name = "data_source")
    private String dataSource;

    @Column(name = "parameters")
    private String parameters;

    @Column(name = "status")
    private int status;

    @Column(name = "result_s3_key")
    private String resultS3Key;

    @Column(name = "request_timestamp")
    private Timestamp timestamp;

    @Column(name = "comments")
    private String comments;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserDetail userDetails;

}
