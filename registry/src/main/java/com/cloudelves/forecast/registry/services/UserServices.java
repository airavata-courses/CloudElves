package com.cloudelves.forecast.registry.services;

import com.cloudelves.forecast.registry.dao.UserDetail;
import com.cloudelves.forecast.registry.exceptions.UserNotFoundException;
import com.cloudelves.forecast.registry.exceptions.UserServicesException;
import com.cloudelves.forecast.registry.model.request.UserDetailsRequest;
import com.cloudelves.forecast.registry.model.response.UserDetailsResponse;
import com.cloudelves.forecast.registry.repository.UserDetailRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Service
@Slf4j
public class UserServices {

    private UserDetailRepository userDetailRepository;

    public UserServices(UserDetailRepository userDetailRepository) {
        this.userDetailRepository = userDetailRepository;
    }

    public UserDetailsResponse getUserDetails(String userId) throws UserNotFoundException {
        log.info("fetching user details for {}", userId);
        Optional<UserDetail> userDetailOpt = userDetailRepository.findById(userId);
        if (userDetailOpt.isEmpty()) {
            String errorMessage = String.format("user %s not found", userId);
            log.error(errorMessage);
            throw new UserNotFoundException(errorMessage);
        }
        log.info("successfully fetched user details for {}", userId);
        UserDetail userDetail = userDetailOpt.get();
        return UserDetailsResponse.builder().name(userDetail.getUserName()).userId(userDetail.getUserId())
                                  .userEmail(userDetail.getUserEmail()).registerTimestamp(userDetail.getRegisterTimestamp().toString())
                                  .build();
    }

    public void addUserDetails(UserDetailsRequest userDetailsRequest) throws UserServicesException {
        Optional<UserDetail> userDetailOpt = userDetailRepository.findById(userDetailsRequest.getUserId());
        if (userDetailOpt.isPresent()) {
            String errorMessage = String.format("user %s is already registered", userDetailsRequest.getUserId());
            log.error(errorMessage);
            throw new UserServicesException(errorMessage);
        }
        Timestamp timestamp = Timestamp.from(Instant.ofEpochMilli(Long.parseLong(userDetailsRequest.getTimestamp())));
        UserDetail userDetail = UserDetail.builder().userId(userDetailsRequest.getUserId()).userName(userDetailsRequest.getName())
                                          .userEmail(userDetailsRequest.getUserEmail()).registerTimestamp(timestamp)
                                          .build();
        userDetailRepository.save(userDetail);
    }

}
