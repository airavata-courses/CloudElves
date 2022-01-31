package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile("default")
@Service
@Slf4j
public class BasicAuthentication implements IAuthenticate{

    @Override
    public boolean verifyToken(String token, String username, String email) throws AuthenticationException {
        return true;
    }
}
