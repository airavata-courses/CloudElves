package com.cloudelves.forecast.registry.dao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Date;

@Entity
@Table(name = "userdetails")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserDetails {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "register_timestamp")
    private Date registerTimestamp;

    @Column(name = "active")
    private boolean active;

}
