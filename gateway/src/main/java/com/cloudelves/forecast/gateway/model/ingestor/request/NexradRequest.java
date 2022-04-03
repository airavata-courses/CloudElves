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
public class NexradRequest {

    private String year;
    private String month;
    private String day;
    private String plotType;

    @JsonProperty("radar")
    private String radarStation;

}
