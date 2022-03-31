package com.cloudelves.forecast.registry.model.response;


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
