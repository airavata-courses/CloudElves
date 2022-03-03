package com.cloudelves.forecast.registry.dao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "plots")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Plots {

    @Id
    private String id;

    @Column(name = "image")
    private String image;

}
