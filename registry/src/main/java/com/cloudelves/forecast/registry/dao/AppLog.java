package com.cloudelves.forecast.registry.dao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "applog")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AppLog {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserDetails user;

    @Column(name = "service_id")
    private String serviceId;

    @Column(name = "action")
    private String action;

    @Column(name = "log_timestamp")
    private Date logTimestamp;

    @Column(name = "status")
    private int status;

    @Column(name = "comments")
    private String comments;

}
