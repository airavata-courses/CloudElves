package com.cloudelves.forecast.registry.model.events;

import com.cloudelves.forecast.registry.model.response.IngestorMeraDataResponse;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class IngestorMeraDataResponseEvent extends BaseEvent {

    private List<IngestorMeraDataResponse> data;

}