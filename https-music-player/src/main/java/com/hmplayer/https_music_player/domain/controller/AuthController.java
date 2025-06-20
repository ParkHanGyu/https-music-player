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

//    @PostMapping("/email/verify")
//    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request, HttpSession session) {
//        String storedCode = (String) session.getAttribute("email_auth_code");
//        String storedEmail = (String) session.getAttribute("email_auth_address");
//
//        if (storedCode == null || storedEmail == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("세션에 인증 정보가 없습니다.");
//        }
//
//        if (!storedEmail.equals(request.getEmail())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일 주소가 일치하지 않습니다.");
//        }
//
//        if (storedCode.equals(request.getCode())) {
//            return ResponseEntity.ok("이메일 인증 성공");
//        } else {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 코드가 일치하지 않습니다.");
//        }
//
//
//        return authService.verifyCodeCheck(request, session);
//    }


}
