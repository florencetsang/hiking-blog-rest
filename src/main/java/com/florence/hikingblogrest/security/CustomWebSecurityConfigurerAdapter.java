package com.florence.hikingblogrest.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class CustomWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
    private static final Logger logger = LoggerFactory.getLogger(CustomWebSecurityConfigurerAdapter.class);

    @Autowired
    private FirebaseAuthFilter firebaseAuthFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .httpBasic().disable()
                .formLogin().disable()
                .authorizeRequests()
                .antMatchers("/", "/static/**", "/favicon.ico", "/FT_Grey_NoSlogan_Small_Circle.PNG").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(firebaseAuthFilter, BasicAuthenticationFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        logger.info("configured security");
//        http.addFilterAfter(new FirebaseAuthFilter(), BasicAuthenticationFilter.class);
    }

//    @Bean
//    public FilterRegistrationBean<FirebaseAuthFilter> firebaseAuthFilter(){
//        final FilterRegistrationBean<FirebaseAuthFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new FirebaseAuthFilter());
//        registrationBean.addUrlPatterns("/api/*");
//        return registrationBean;
//    }
}