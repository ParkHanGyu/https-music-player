package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignInResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.accessTokenReissueResponse;
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

    ResponseEntity <?> authNumberSend(HttpSession session, String userEmail);


}
