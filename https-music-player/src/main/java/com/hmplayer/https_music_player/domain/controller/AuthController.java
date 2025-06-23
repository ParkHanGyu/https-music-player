package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.TestEmailSendRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.AuthNumberSendResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignInResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.accessTokenReissueResponse;
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

//    @PostMapping("/authNumberSend")
//    public ResponseEntity<?> authNumberSend(HttpServletRequest request, String userEmail) {
//        HttpSession session = request.getSession(); // 세션얻어옴
//        log.info("HttpServletRequest request = {}, String user_email = {}", request, userEmail);
//        return authService.authNumberSend(session, userEmail); // 메일보내기
//    }


    @PostMapping("/email/send")
    public ResponseEntity<? super AuthNumberSendResponse> authNumberSend(@RequestBody TestEmailSendRequest request, HttpSession session) {
                log.info("HttpServletRequest userEmail = {}, String session = {}", request, session);
        return authService.authNumberSend(request,session);
    }


    // 수정해서 인증번호 대조하는걸로 바꾸기
//    @PostMapping("/email/send")
//    public ResponseEntity<? super AuthNumberSendResponse> authNumberSend(@RequestBody TestEmailSendRequest request, HttpSession session) {
//        log.info("HttpServletRequest userEmail = {}, String session = {}", request, session);
//        return authService.authNumberSend(request,session);
//    }


}
