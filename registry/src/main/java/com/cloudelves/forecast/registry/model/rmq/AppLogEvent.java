package com.cloudelves.forecast.registry.model.rmq;

import com.cloudelves.forecast.registry.model.request.AppLogRequest;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class AppLogEvent extends BaseEvent {

    private AppLogRequest data;

}
