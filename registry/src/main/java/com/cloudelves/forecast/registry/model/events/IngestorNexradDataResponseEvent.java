package com.cloudelves.forecast.registry.model.events;

import com.cloudelves.forecast.registry.model.response.IngestorNexradDataResponse;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class IngestorNexradDataResponseEvent extends BaseEvent {

    private IngestorNexradDataResponse data;

}