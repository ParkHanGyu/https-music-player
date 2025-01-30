package com.hmplayer.https_music_player.domain.security;

import com.hmplayer.https_music_player.domain.jpa.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;

@Component
public class JwtSecurity {
    @Value("${jwt.secretKey}")
    private String secretKey;


    public String createAccessToken(String email){
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS)); // 엑세스 토큰 유효시간 1시간
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        String jwt = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)
                .setSubject(email).setIssuedAt(new Date()).setExpiration(expiredDate)
                .compact();
        return jwt;
    }


    public String createRefreshToken(String email) {
        Date expiredDate = Date.from(Instant.now().plus(4, ChronoUnit.HOURS)); // 리프레시 토큰 유효시간 1시간
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        String refresh = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)
                .setSubject(email).setIssuedAt(new Date()).setExpiration(expiredDate)
                .compact();

        return refresh;
    }




    public String validate(String jwt){ // JWT 토큰의 유효성 검사 후 email반환
        Claims claims = null;
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        try{
            claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt).getBody();
        }catch (ExpiredJwtException e) {
            throw e; // 예외를 던져서 상위 메서드에서 처리하도록 함
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
        return claims.getSubject();
    }


    // JWT 토큰의 유효성 검사 (boolean 반환)
    public boolean isValid(String jwt) {
        Claims claims = null;
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        try {
            // JWT 토큰의 유효성 검사
            claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt).getBody();
        } catch (ExpiredJwtException e) {
            // 토큰이 만료된 경우
            return false;
        } catch (SignatureException e) {
            // 서명 오류 발생
            return false;
        } catch (Exception e) {
            // 기타 오류 처리
            return false;
        }
        return true;  // 유효한 토큰인 경우
    }


    // JWT에서 이메일 추출
    public String getEmailFromToken(String token) {
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject(); // 이메일이 subject로 저장된 경우
    }


    // 토큰의 유효시간 추출
    public int extractExpiration(String token) {
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        long currentTimeMillis = System.currentTimeMillis(); // 현재 시간 밀리초
        long expirationTimeMillis = claims.getExpiration().getTime(); // JWT에서 추출한 만료 시간 밀리초

        // Expiration을 초 단위 UNIX 타임스탬프로 변환
        return (int) ((expirationTimeMillis - currentTimeMillis) / 1000);
    }



}