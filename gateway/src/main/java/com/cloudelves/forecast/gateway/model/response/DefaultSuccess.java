package com.cloudelves.forecast.gateway.model.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DefaultSuccess {

    private String message;
    private String statusCode;

}
