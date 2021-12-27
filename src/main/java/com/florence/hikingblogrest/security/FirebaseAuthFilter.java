package com.florence.hikingblogrest.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.WebServiceException;
import java.io.IOException;

import static java.util.Collections.emptyList;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LogManager.getLogger(FirebaseAuthFilter.class);
    private final BearerTokenResolver bearerTokenResolver = new DefaultBearerTokenResolver();

    private String getUserIdFromAuthToken(String authToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(authToken);
        String uid = decodedToken.getUid();
        LOGGER.info("Decoded idToken [{}] to uid [{}]", authToken, uid);
        return uid;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {

        final String firebaseToken = bearerTokenResolver.resolve(httpServletRequest);

        if (StringUtils.isEmpty(firebaseToken)) {
            LOGGER.warn("Failed request - Firebase token is invalid or not found. Please make sure it is passed in the HEADER");
            httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Please contact tech support to verify your entitlements");
        } else {
            LOGGER.info("Firebase token [{}] attempting to access [{}]", firebaseToken, httpServletRequest.getRequestURI());
            try {
                final String uid = getUserIdFromAuthToken(firebaseToken);
                if (!StringUtils.isEmpty(uid)) {
                    LOGGER.info("User [{}] has been granted access to resource [{}]", uid, httpServletRequest.getRequestURI());

                    final UserPrincipal userPrincipal = new UserPrincipal(uid);
                    final UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, emptyList());

                    // authenticate user
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    filterChain.doFilter(httpServletRequest, httpServletResponse);
                } else {
                    LOGGER.warn("Failed to verify entitlements for firebase token [{}]", firebaseToken);
                    httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Please contact tech support to verify your entitlements");
                }
            } catch (FirebaseAuthException e) {
                LOGGER.warn("Failed to verify entitlements for firebase token [{}]", firebaseToken, e);
                throw new WebServiceException(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }
    }
}
