package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.dao.Plots;
import com.cloudelves.forecast.registry.model.response.PlotsResponse;
import com.cloudelves.forecast.registry.repository.PlotsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class PlotsController {

    @Autowired
    private PlotsRepository plotsRepository;

    @GetMapping("/getPlot")
    public ResponseEntity getPlotById(@RequestParam("id") String id) {
        Optional<Plots> plotsOpt = plotsRepository.findById(id);
        if (plotsOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            Plots plot = plotsOpt.get();
            return ResponseEntity.ok(PlotsResponse.builder().id(id).image(plot.getImage()).build());
        }
    }

}
