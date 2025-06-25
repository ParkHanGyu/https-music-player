package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.AuthNumberCheckRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.TestEmailSendRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.*;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;


    @PostMapping("/sign-up") // 회원가입
    public ResponseEntity<? super SignUpResponse> signUp(@RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    @PostMapping("/sign-in") // 로그인
    public ResponseEntity<? super SignInResponse> signIn(@RequestBody SignInRequest request) {
        return authService.signIn(request);
    }

    @PostMapping("/refresh") // 토큰 재발급 요청
    public ResponseEntity<? super accessTokenReissueResponse> refreshAccessToken(@RequestHeader("Authorization") String token) {
        return authService.refreshAccessToken(token);
    }

    @PostMapping("/email/send") // 이메일 인증번호 요청
    public ResponseEntity<? super AuthNumberSendResponse> authNumberSend(@RequestBody TestEmailSendRequest request) {
                log.info("HttpServletRequest userEmail = {}", request);
        return authService.authNumberSend(request);
    }

    // 인증번호 확인
//    @PostMapping("/authNumber-check")
//    public ResponseEntity<? super AuthNumberCheckResponse> authNumberCheck(@RequestBody AuthNumberCheckRequest request, HttpSession session) {
//        log.info("AuthNumberCheckRequest request = {}, HttpSession session = {}", request, session);
//        return authService.authNumberCheck(request,session);
//    }

    @PostMapping("/authNumber-check")
    public ResponseEntity<? super AuthNumberCheckResponse> authNumberCheck(@RequestBody AuthNumberCheckRequest request, HttpServletRequest httpServletRequest) {

        HttpSession session = httpServletRequest.getSession(false); // false: 세션이 없으면 null 반환
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        session.setAttribute("", request.getEmail());
        String sessionCode = (String) session.getAttribute("email_auth_code");
        String sessionEmail = (String) session.getAttribute("email_auth_address");

        log.info("클라이언트에서 받아온 데이터 - 이메일 = {}, 코드 = {}", request.getEmail(), request.getAuthNumber());
        log.info("서버에 가지고 있는 세션 - 이메일 = {}, 코드 = {}", sessionEmail, sessionCode);


        return null;
    }


}
