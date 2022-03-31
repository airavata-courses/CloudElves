package com.cloudelves.forecast.registry.model.response;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class IngestorResponse {

    private String requestId;
    private int status;
    private String resultS3Key;
    private String comments;

}
