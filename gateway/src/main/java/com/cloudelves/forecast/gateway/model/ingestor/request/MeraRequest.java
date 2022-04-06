package com.cloudelves.forecast.gateway.model.ingestor.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MeraRequest {

    private String product;
    private String startDate;
    private String endDate;
    private List<String> varNames;
    private String outputType;

    public MeraRequest(MeraRequest meraRequest) {
        this.product = meraRequest.getProduct();
        this.startDate = meraRequest.getStartDate();
        this.endDate = meraRequest.getEndDate();
        this.varNames = meraRequest.getVarNames();
        this.outputType = meraRequest.getOutputType();
    }
}
