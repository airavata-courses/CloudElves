package com.cloudelves.forecast.registry.model.request;

import lombok.*;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CreatePlotRequest {

    private String requestId;
    private String dataSource;
    private Map<String, String> parameters;
    private String userId;
    private String timestamp;
    private int status;

    public String stringifyParameters() {
        StringBuilder stringBuilder = new StringBuilder();
        for (String key : parameters.keySet()) {
            stringBuilder.append(String.format("%s=%s\n", key, parameters.get(key)));
        }
        return stringBuilder.toString();
    }
}
