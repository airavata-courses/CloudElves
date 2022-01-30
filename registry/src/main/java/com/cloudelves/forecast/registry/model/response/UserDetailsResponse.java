package com.cloudelves.forecast.registry.model.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDetailsResponse {

    private String userId, userEmail, timestamp;
    private boolean active;

}
