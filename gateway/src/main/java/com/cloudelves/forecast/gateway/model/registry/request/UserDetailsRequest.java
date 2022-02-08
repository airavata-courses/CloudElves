package com.cloudelves.forecast.gateway.model.registry.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDetailsRequest {

    private String userId, userEmail, name, timestamp;

}
