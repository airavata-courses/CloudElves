package com.cloudelves.forecast.registry.controller;

import com.cloudelves.forecast.registry.exceptions.EventsServiceException;
import com.cloudelves.forecast.registry.model.response.UserEventResponse;
import com.cloudelves.forecast.registry.services.EventsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EventsController {

    private EventsService eventsService;

    public EventsController(EventsService eventsService) {
        this.eventsService = eventsService;
    }

    @GetMapping(value = "/getEvents")
    public ResponseEntity<List<UserEventResponse>> getUserEvents(@RequestParam("userId") String userId,
                                                                 @RequestParam(value = "numItems", required = false, defaultValue = "10")
                                                                         int numItems) throws EventsServiceException {
        return ResponseEntity.ok(eventsService.getUserEvents(userId, numItems));
    }
}
