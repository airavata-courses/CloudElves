package com.cloudelves.forecast.gateway.exception.handlers;

import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.exception.BaseException;
import com.cloudelves.forecast.gateway.model.response.DefaultError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
public class DefaultHandler {

    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity handleAuthException(AuthenticationException e) {
        log.error("authentication error: ", e);
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.UNAUTHORIZED.toString()).build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(value = {BaseException.class})
    public ResponseEntity handleBaseException(BaseException e) {
        log.error("error while handling request: ", e);
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

}
