package com.cloudelves.forecast.gateway.model.events;

import com.cloudelves.forecast.gateway.model.ingestor.request.MeraRequest;
import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MeraGetDataEvent extends BaseEvent {

    @Builder
    public MeraGetDataEvent(String specversion, String type, String source, String subject, String id, String time,
                            String datacontentType, MeraRequest data) {
        super(specversion, type, source, subject, id, time, datacontentType);
        this.data = data;
    }

    private MeraRequest data;
}
