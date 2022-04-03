package com.cloudelves.forecast.gateway.model.registry.response;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserEventResponse {

    private String eventId;

    private String eventName;

    private String eventTimestamp;

}
