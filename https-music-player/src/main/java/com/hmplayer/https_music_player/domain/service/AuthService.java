package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.auth.AuthNumberCheckRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.TestEmailSendRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.*;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.io.UnsupportedEncodingException;

public interface AuthService {

    ResponseEntity<? super SignUpResponse> signUp(SignUpRequest request);

    ResponseEntity<? super SignInResponse> signIn(SignInRequest request);

    ResponseEntity<? super accessTokenReissueResponse> refreshAccessToken(String token);

    ResponseEntity<? super AuthNumberSendResponse> authNumberSend(TestEmailSendRequest request);

    ResponseEntity<? super AuthNumberCheckResponse> authNumberCheck(AuthNumberCheckRequest request, HttpSession session);

    }
