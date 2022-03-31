package com.cloudelves.forecast.registry.model.events;

import com.cloudelves.forecast.registry.model.response.DefaultError;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ErrorEvent {
    private DefaultError data;
}
