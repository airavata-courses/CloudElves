package com.cloudelves.forecast.registry.model.rmq;

import com.cloudelves.forecast.registry.model.response.IngestorResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngestorResponseEvent extends BaseEvent {

    private IngestorResponse data;

}
