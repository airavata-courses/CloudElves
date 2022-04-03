package com.cloudelves.forecast.gateway.model.events;

import com.cloudelves.forecast.gateway.model.ingestor.request.NexradRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class IngestorGetDataEvent extends BaseEvent {

    @Builder
    public IngestorGetDataEvent(String specversion, String type, String source, String subject, String id, String time,
                                String datacontentType, NexradRequest data) {
        super(specversion, type, source, subject, id, time, datacontentType);
        this.data = data;
    }

    private NexradRequest data;
}
