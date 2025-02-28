package com.hmplayer.https_music_player.domain.security;

import io.jsonwebtoken.ExpiredJwtException;
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
        log.info("JWTAuthenticationFilter - doFilterInternal() 실행");

        try {
            String token = parseBearerToken(request);
            log.info("검증 이후 token값 : " + token);

            if (token == null) {
                log.info("토큰 없음");
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtSecurity.validate(token);
            if (email == null) {
                log.info("잘못된 토큰");
                filterChain.doFilter(request, response);
                return;
            }

            log.info("JWT token에서 얻은 email: {}", email);

            AbstractAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);
        } catch (ExpiredJwtException e) {
            log.error("만료된 토큰", e);  // 만료된 토큰에 대한 에러 로그
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401 상태 코드 설정
            response.getWriter().write("만료된 토큰");  // 만료된 토큰 메시지 전송
            return;  // 이후 필터 체인을 더 이상 진행하지 않음
        } catch (Exception e) {
            log.error("Error in JWT Authentication Filter", e);  // 일반적인 에러 로그
        }
        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request){
        log.info("parseBearerToken() 토큰 검증 실행");
        String authorization = request.getHeader("Authorization");

        boolean hasAuthorization = StringUtils.hasText(authorization);
        if(!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer "); // "Bearer " 로 시작하느냐?
        if(!isBearer) return null;

        String token = authorization.substring(7);
        log.info("검증할 토큰 값 : {}", token);
        return token;
    }
}
