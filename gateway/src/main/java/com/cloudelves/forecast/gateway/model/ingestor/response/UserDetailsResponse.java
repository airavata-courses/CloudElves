package com.cloudelves.forecast.gateway.model.ingestor.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDetailsResponse {

    private String userId, userEmail, name, timestamp;
    private boolean active;

}
