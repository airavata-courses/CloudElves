package com.cloudelves.forecast.gateway.model.ingestor.response;


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
