package com.cloudelves.forecast.registry.model.response;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class IngestorMeraDataResponse {

    private String dataId;
    private String dataS3Key;
    private String date;
    private String variable;
    private int status;
    private String expirationTime;

}
