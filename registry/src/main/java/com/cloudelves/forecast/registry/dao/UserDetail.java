package com.cloudelves.forecast.registry.dao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "userdetails")
public class UserDetail {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "email")
    private String userEmail;

    @Column(name = "name")
    private String userName;

    @Column(name = "first_login_timestamp")
    private Timestamp registerTimestamp;

    @OneToMany(mappedBy = "userDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserEvent> events = new HashSet<>();

    @OneToMany(mappedBy = "userDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserRequests> requests = new HashSet<>();
}
