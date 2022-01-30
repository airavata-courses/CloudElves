package com.cloudelves.forecast.registry.model.response;

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
