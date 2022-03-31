package com.cloudelves.forecast.registry.model.response;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Id;
import java.sql.Timestamp;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class IngestorNexradDataResponse {

    private String dataId;
    private String dataS3Key;
    private String startTime;
    private String endTime;
    private String radarName;
    private int status;
    private String expirationTime;

}
