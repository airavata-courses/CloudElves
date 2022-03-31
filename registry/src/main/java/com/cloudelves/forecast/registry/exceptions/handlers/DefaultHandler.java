package com.cloudelves.forecast.registry.exceptions.handlers;

import com.cloudelves.forecast.registry.exceptions.BaseException;
import com.cloudelves.forecast.registry.exceptions.EventsServiceException;
import com.cloudelves.forecast.registry.exceptions.UserNotFoundException;
import com.cloudelves.forecast.registry.exceptions.UserServicesException;
import com.cloudelves.forecast.registry.model.response.DefaultError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class DefaultHandler {

    @ExceptionHandler(value = {UserNotFoundException.class})
    public ResponseEntity<DefaultError> handleUserNotFoundException(UserNotFoundException e) {
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.NOT_FOUND.toString()).build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(value = {UserServicesException.class})
    public ResponseEntity<DefaultError>  handleUserServicesException(UserServicesException e) {
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.NOT_FOUND.toString()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(value = {EventsServiceException.class})
    public ResponseEntity<DefaultError>  handleEventsServiceException(EventsServiceException e) {
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.NOT_FOUND.toString()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(value = {BaseException.class})
    public ResponseEntity<DefaultError>  handleBaseException(BaseException e) {
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<DefaultError>  handleException(Exception e) {
        DefaultError error = DefaultError.builder().error(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

}
