package com.cloudelves.forecast.gateway.services;

import com.cloudelves.forecast.gateway.exception.AuthenticationException;

public interface IAuthenticate {

    boolean verifyToken(String token, String username, String email) throws AuthenticationException;

}
