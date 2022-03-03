package com.cloudelves.forecast.gateway.model.events;

import com.cloudelves.forecast.gateway.model.ingestor.request.IngestorRequest;
import com.cloudelves.forecast.gateway.model.registry.request.AppLogRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LogEvent extends BaseEvent {

    @Builder
    public LogEvent(String specversion, String type, String source, String subject, String id, String time,
                    String datacontentType, AppLogRequest data) {
        super(specversion, type, source, subject, id, time, datacontentType);
        this.data = data;
    }

    private AppLogRequest data;
}
