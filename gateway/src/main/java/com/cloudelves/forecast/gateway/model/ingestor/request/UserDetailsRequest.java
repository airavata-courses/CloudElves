package com.cloudelves.forecast.gateway.model.ingestor.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDetailsRequest {

    private String userId, userEmail, name, timestamp;

}
