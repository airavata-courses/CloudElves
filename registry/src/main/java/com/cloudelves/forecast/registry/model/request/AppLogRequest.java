package com.cloudelves.forecast.registry.model.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AppLogRequest {

    private String userId, serviceId, timestamp, comments;
    private int status;

}
