package com.cloudelves.forecast.registry.model.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDetailsResponse {

    private String userId;
    private String userEmail;
    private String name;
    private String registerTimestamp;

}
