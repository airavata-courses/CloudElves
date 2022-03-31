package com.cloudelves.forecast.registry.model.events;

import com.cloudelves.forecast.registry.model.request.CreatePlotRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePlotRequestEvent extends BaseEvent {

    private CreatePlotRequest data;

}
