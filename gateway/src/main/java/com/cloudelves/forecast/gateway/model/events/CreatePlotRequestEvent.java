package com.cloudelves.forecast.gateway.model.events;

import com.cloudelves.forecast.gateway.model.ingestor.request.CreatePlotRequest;
import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePlotRequestEvent extends BaseEvent {

    @Builder
    public CreatePlotRequestEvent(String specversion, String type, String source, String subject, String id, String time,
                                String datacontentType, CreatePlotRequest data) {
        super(specversion, type, source, subject, id, time, datacontentType);
        this.data = data;
    }

    private CreatePlotRequest data;

}
