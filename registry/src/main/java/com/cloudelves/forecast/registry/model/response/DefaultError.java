package com.cloudelves.forecast.registry.model.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DefaultError {

    private String error;
    private String statusCode;

}
