package com.cloudelves.forecast.registry.model.response;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AppLogResponse {
    private String id, userId, serviceId, timestamp, comments;
    private int status;
}
