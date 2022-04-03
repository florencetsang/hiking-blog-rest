package com.florence.hikingblogrest.rest;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    private static final String FORWARD_VIEW_NAME = "forward:/";

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:\\w+}")
                .setViewName(FORWARD_VIEW_NAME);
        registry.addViewController("/**/{spring:\\w+}")
                .setViewName(FORWARD_VIEW_NAME);
        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
                .setViewName(FORWARD_VIEW_NAME);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // details and knowledge:
        // not used for now with Spring Security and corsConfigurationSource
        // will be merged with controller config (org.springframework.web.cors.CorsConfiguration.combine(org.springframework.web.cors.CorsConfiguration))
        // controller annotation is set up at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping.initCorsConfiguration
    }
}