package com.cloudelves.forecast.gateway.model.response;

import com.cloudelves.forecast.gateway.model.forecaster.response.ForecastResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataResponse {
    private String imageUrl;
    private boolean stormExist;
    private ForecastResponse weatherForecast;
}
