package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.AuthNumberCheckRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.AuthNumberRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
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

    @PostMapping("/sign-up/verifications") // 이메일 인증번호 요청
    public ResponseEntity<? super AuthNumberSendResponse> authNumberSend(@RequestBody AuthNumberRequest request) {
                log.info("HttpServletRequest userEmail = {}", request);
        return authService.authNumberSend(request);
    }

    @PostMapping("/authNumber-check")
    public ResponseEntity<? super AuthNumberCheckResponse> authNumberCheck(@RequestBody AuthNumberCheckRequest request) {
        return authService.authNumberCheck(request);
    }


}
