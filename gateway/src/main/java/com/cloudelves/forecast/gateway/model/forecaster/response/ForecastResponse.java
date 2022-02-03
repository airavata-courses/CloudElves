package com.cloudelves.forecast.gateway.model.forecaster.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ForecastResponse {

    @JsonProperty("min_temp")
    private Integer minTemp;

    @JsonProperty("max_temp")
    private Integer maxTemp;

    private Integer humidity, pressure;

    @JsonProperty("weather_description")
    private String weatherDescription;


}
