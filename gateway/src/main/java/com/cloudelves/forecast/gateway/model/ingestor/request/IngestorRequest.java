package com.cloudelves.forecast.gateway.model.ingestor.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IngestorRequest {

    private Integer year, month, day;
    private String startTime, endTime;
    private String radarStation;

}
