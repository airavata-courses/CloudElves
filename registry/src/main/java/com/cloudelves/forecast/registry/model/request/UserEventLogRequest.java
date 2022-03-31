package com.cloudelves.forecast.registry.model.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserEventLogRequest {

    private String id;
    private String userId;
    private String eventName;
    private String eventTimestamp;

}
