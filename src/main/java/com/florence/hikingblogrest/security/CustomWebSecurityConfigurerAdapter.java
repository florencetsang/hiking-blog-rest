package com.florence.hikingblogrest.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class CustomWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
    private static final Logger logger = LoggerFactory.getLogger(CustomWebSecurityConfigurerAdapter.class);

    private static final String APIS_PATH_PATTERN = "/api/**";

    @Value("#{'${cors.api.origins}'.split(',')}")
    private List<String> corsOrigins;
    @Autowired
    private FirebaseAuthFilter firebaseAuthFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // enable CORS, config is set with corsConfigurationSource
                .cors().and()
                .csrf().disable()
                .httpBasic().disable()
                .formLogin().disable()
                .antMatcher(APIS_PATH_PATTERN)
                .authorizeRequests()
                .anyRequest().authenticated()
//                .antMatchers("/api/**").not().permitAll()
//                .anyRequest().permitAll()
//                .antMatchers("/", "/map", "/newPost", "/test", "/static/**", "/favicon.ico", "/FT_Grey_NoSlogan_Small_Circle.PNG").permitAll()
//                .antMatchers("/api/**").authenticated()
//                .anyRequest().authenticated()
//                .antMatchers("/api/**").authenticated()
//                .anyRequest().permitAll()
                .and()
                .addFilterBefore(firebaseAuthFilter, BasicAuthenticationFilter.class)
//                .antMatcher("/testApi/**")
//                .authorizeRequests()
//                .anyRequest().authenticated()
//                .and()
//                .addFilterBefore(firebaseAuthFilter, BasicAuthenticationFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        logger.info("configured security");
//        http.addFilterAfter(new FirebaseAuthFilter(), BasicAuthenticationFilter.class);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        // details and knowledge:
        // corsConfigurationSource takes precedence over web MVC CORS settings for Spring Security (org.springframework.security.config.annotation.web.configurers.CorsConfigurer)
        // Spring security filters (FilterChainProxy) are run before request handler (debug org.apache.catalina.core.ApplicationFilterChain.internalDoFilter)
        logger.info("configure CORS origins as {}", corsOrigins);
        final CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsOrigins);
        // CORS will get requesting method for pre-flight request, so OPTIONS is not needed (org.springframework.web.cors.DefaultCorsProcessor.getMethodToUse)
        // same for other fields
        configuration.setAllowedMethods(Arrays.asList(HttpMethod.GET.name(), HttpMethod.POST.name()));
        // authorization header is used for authentication, so it needs to be added
        configuration.setAllowedHeaders(List.of("authorization"));
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // allow CORS for all /api, if finer control is needed, separate different API paths
        // however, this should not be the central place for path mapping
        // change to use web MVC global config, which will be merged with controller config if needed (org.springframework.web.cors.CorsConfiguration.combine(org.springframework.web.cors.CorsConfiguration))
        source.registerCorsConfiguration(APIS_PATH_PATTERN, configuration);
        return source;
    }

//    @Bean
//    public FilterRegistrationBean<FirebaseAuthFilter> firebaseAuthFilter(){
//        final FilterRegistrationBean<FirebaseAuthFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new FirebaseAuthFilter());
//        registrationBean.addUrlPatterns("/api/*");
//        return registrationBean;
//    }
}