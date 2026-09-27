package com.interviewplatform.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;
    private final String allowedOrigins;

    public WebSocketConfig(
            WebSocketAuthInterceptor webSocketAuthInterceptor,
            @Value("${cors.allowed-origins:http://localhost:5173}") String allowedOrigins
    ) {
        this.webSocketAuthInterceptor =
                webSocketAuthInterceptor;
        this.allowedOrigins =
                allowedOrigins;
    }

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry config
    ) {

        /*
         * Messages sent to /topic are broadcast
         * to subscribed clients.
         */
        config.enableSimpleBroker("/topic");

        /*
         * Client application messages start with /app.
         */
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        String[] origins;
        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            origins = Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(origin -> !origin.isEmpty())
                    .toArray(String[]::new);
        } else {
            origins = new String[] { "http://localhost:5173" };
        }

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(origins);
    }

    @Override
    public void configureClientInboundChannel(
            org.springframework.messaging.simp.config.ChannelRegistration registration
    ) {

        /*
         * Register WebSocket JWT authentication interceptor.
         */
        registration.interceptors(
                webSocketAuthInterceptor
        );
    }
}