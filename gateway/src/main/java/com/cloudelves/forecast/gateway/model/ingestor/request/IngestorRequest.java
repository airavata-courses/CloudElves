package com.cloudelves.forecast.gateway.model.ingestor.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IngestorRequest {

    private String year, month, day;
    private String startTime, endTime, userId;

    @JsonProperty("radar")
    private String radarStation;

}
