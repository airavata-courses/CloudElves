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
@Table(name = "usereventlog")
public class UserEvent {

    @Id
    @Column(name = "event_id")
    private String eventId;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "event_timestamp")
    private Timestamp eventTimestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserDetail userDetails;
}
