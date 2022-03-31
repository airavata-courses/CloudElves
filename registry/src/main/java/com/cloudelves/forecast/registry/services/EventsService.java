package com.cloudelves.forecast.registry.services;

import com.cloudelves.forecast.registry.dao.UserEvent;
import com.cloudelves.forecast.registry.exceptions.EventsServiceException;
import com.cloudelves.forecast.registry.model.response.UserEventResponse;
import com.cloudelves.forecast.registry.repository.UserEventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class EventsService {

    private UserEventRepository userEventRepository;

    public EventsService(UserEventRepository userEventRepository) {
        this.userEventRepository = userEventRepository;
    }

    public List<UserEventResponse> getUserEvents(String userId, int numEvents) throws EventsServiceException {
        try {
            List<UserEvent> userEventList = userEventRepository.findLatestEventsByUserId(userId, numEvents);
            List<UserEventResponse> userEventResponseList = new ArrayList<>();
            userEventList.forEach(userEvent -> {
                String timestampString = userEvent.getEventTimestamp().toString();
                userEventResponseList.add(UserEventResponse.builder().eventId(userEvent.getEventId()).eventName(userEvent.getEventName())
                                                           .eventTimestamp(timestampString).build());
            });
            log.info("successfully fetched events for user {}", userId);
            return userEventResponseList;
        } catch (Exception e) {
            String errorMessage = String.format("error while fetching user events for %s: %s", userId, e.getMessage());
            log.error(errorMessage);
            throw new EventsServiceException(errorMessage);
        }
    }
}
