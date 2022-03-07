package com.cloudelves.forecast.registry.model.rmq;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseEvent {
    @JsonProperty("specversion")
    private String specVersion;

    @JsonProperty("type")
    private String type;

    @JsonProperty("source")
    private String source;

    @JsonProperty("subject")
    private String subject;

    @JsonProperty("id")
    private String id;

    @JsonProperty("time")
    private String time;

    @JsonProperty("datacontenttype")
    private String dataContentType;

}
