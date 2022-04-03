package com.cloudelves.forecast.gateway.configuration;

import com.cloudelves.forecast.gateway.constants.Constants;
import com.cloudelves.forecast.gateway.exception.AuthenticationException;
import com.cloudelves.forecast.gateway.services.IAuthenticate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class AuthenticationFilter implements Filter {

    private IAuthenticate authenticationService;

    public AuthenticationFilter(IAuthenticate authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("initialising authentication filter");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        try {
            authenticationService.verifyToken(request.getHeader(Constants.TOKEN_HEADER), request.getHeader(Constants.USERNAME_HEADER),
                                              request.getHeader(Constants.EMAIL_HEADER));
            filterChain.doFilter(request, response);
        } catch (AuthenticationException e) {
            log.error("user authentication failed");
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        }

    }

    @Override
    public void destroy() {

    }

}
