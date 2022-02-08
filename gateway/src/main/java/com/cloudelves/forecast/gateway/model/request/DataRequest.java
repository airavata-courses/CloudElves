package com.cloudelves.forecast.gateway.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataRequest {
    private Integer year, month, day;
    private String startTime, endTime;
    private String radarStation;
}
