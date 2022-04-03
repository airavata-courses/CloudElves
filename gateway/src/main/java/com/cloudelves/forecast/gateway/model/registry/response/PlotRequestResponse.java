package com.cloudelves.forecast.gateway.model.registry.response;

import lombok.*;

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
