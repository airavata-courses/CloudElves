package com.cloudelves.forecast.registry.model.events;

import com.cloudelves.forecast.registry.model.request.UserEventLogRequest;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class UserEventLogEvent extends BaseEvent {

    private UserEventLogRequest data;

}
