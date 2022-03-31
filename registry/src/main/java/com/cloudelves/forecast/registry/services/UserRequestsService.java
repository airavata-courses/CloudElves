package com.cloudelves.forecast.registry.services;

import com.cloudelves.forecast.registry.dao.UserDetail;
import com.cloudelves.forecast.registry.dao.UserRequests;
import com.cloudelves.forecast.registry.model.response.PlotRequestResponse;
import com.cloudelves.forecast.registry.repository.UserDetailRepository;
import com.cloudelves.forecast.registry.repository.UserRequestsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserRequestsService {

    private UserRequestsRepository userRequestsRepository;

    public UserRequestsService(UserRequestsRepository userRequestsRepository) {
        this.userRequestsRepository = userRequestsRepository;
    }

    public List<PlotRequestResponse> getUserRequests(String userId) {
        List<PlotRequestResponse> result = new ArrayList<>();
        List<UserRequests> userRequestsList = userRequestsRepository.findByUserId(userId);
        userRequestsList.forEach(userRequest -> {
            PlotRequestResponse plotRequestResponse = PlotRequestResponse.builder().requestId(userRequest.getRequestId())
                                                                         .dataSource(userRequest.getDataSource())
                                                                         .parameters(userRequest.getParameters())
                                                                         .resultS3Key(userRequest.getResultS3Key())
                                                                         .comments(userRequest.getComments())
                                                                         .status(userRequest.getStatus())
                                                                         .timestamp(userRequest.getTimestamp().toString()).build();
            result.add(plotRequestResponse);
        });
        return result;
    }
}
