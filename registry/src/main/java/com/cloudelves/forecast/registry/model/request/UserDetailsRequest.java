package com.cloudelves.forecast.registry.model.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDetailsRequest {

    private String userId, userEmail, name, timestamp;

}
