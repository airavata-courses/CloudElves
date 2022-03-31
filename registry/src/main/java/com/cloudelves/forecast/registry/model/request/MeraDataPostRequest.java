package com.cloudelves.forecast.registry.model.request;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class MeraDataPostRequest {

    private List<String> dates;
    private String variable;

}
