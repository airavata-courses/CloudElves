package com.cloudelves.forecast.gateway.model.registry.response;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AppLogResponse {
    private String id, userId, serviceId, action, timestamp, comments;
    private int status;
}
