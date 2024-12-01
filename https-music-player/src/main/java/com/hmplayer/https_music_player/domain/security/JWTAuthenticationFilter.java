package com.hmplayer.https_music_player.domain.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JwtSecurity jwtSecurity;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("JWTAuthenticationFilter is processing the request");  // 필터가 실행되는지 확인

        try {
            String token = parseBearerToken(request);
            if (token == null) {
                log.info("No Bearer token found, continuing filter chain");
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtSecurity.validate(token);
            if (email == null) {
                log.info("Invalid token, continuing filter chain");
                filterChain.doFilter(request, response);
                return;
            }

            log.info("JWT token validated successfully for email: {}", email);  // 로그가 출력되지 않으면 여기까지 오지 않음

            AbstractAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);
        } catch (Exception e) {
            log.error("Error in JWT Authentication Filter", e);  // 예외 발생 시 에러 로그
        }
        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request){
        log.info("검증할 토큰 값 request : {}", request.toString());

        String authorization = request.getHeader("Authorization");
        log.info("검증할 토큰 값 authorization : {}", authorization);

        boolean hasAuthorization = StringUtils.hasText(authorization);
        log.info("검증할 토큰 값 hasAuthorization : {}", hasAuthorization);

        if(!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer "); // "Bearer " 로 시작하느냐?
        if(!isBearer) return null;
        String token = authorization.substring(7);
        log.info("검증할 토큰 값 : {}", token);

        return token;
    }
}
