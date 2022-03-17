package com.florence.hikingblogrest.rest;

import org.springframework.context.annotation.Configuration;
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
}