package com.cloudelves.forecast.registry.model.response;

import com.cloudelves.forecast.registry.dao.MeraData;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MeraDataResponse {

    Map<String, MeraData> completed;
    Map<String, MeraData> inProgress;
    List<String> unavailable;

}
