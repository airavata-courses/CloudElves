package com.cloudelves.forecast.registry.model.response;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Id;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class PlotRequestResponse {

    private String requestId;

    private String dataSource;

    private String parameters;

    private int status;

    private String resultS3Key;

    private String timestamp;

    private String comments;

}
