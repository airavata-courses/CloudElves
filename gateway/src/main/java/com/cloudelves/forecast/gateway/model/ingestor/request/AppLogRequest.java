package com.cloudelves.forecast.gateway.model.ingestor.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AppLogRequest {

    private String userId, serviceId, action, timestamp, comments;
    private int status;

}
