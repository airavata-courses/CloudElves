package com.cloudelves.forecast.gateway.model.registry.request;

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
