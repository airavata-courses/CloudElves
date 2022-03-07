package com.cloudelves.forecast.registry.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IngestorResponse {

    private String id;
    private String action;
    private String comments;
    private int status;
    private String image;
    private String userId;

}
