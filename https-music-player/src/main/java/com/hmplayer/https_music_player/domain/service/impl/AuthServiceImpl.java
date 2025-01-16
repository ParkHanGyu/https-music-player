package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignInResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@RequiredArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepoService userRepoService;
    private final JwtSecurity jwtSecurity;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Override
    public ResponseEntity<? super SignUpResponse> signUp(SignUpRequest request) {
        try {
            // 중복 회원(이메일)
            Optional<User> findExistingUser = userRepoService.existCheckEmail(request.getEmail());
            if (findExistingUser.isPresent()) return SignUpResponse.existingUser();

            String password = passwordEncoder.encode(request.getPassword());
            User user = SignUpRequest.of(request, password);
            userRepoService.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return SignUpResponse.databaseError();
        }
        return SignUpResponse.sucess();
    }

    
    // 로그인 요청
    @Override
    public ResponseEntity<? super SignInResponse> signIn(SignInRequest request) {
        System.out.println("클라이언트에서 받은 request.getPassword()값 : "+request.getPassword());
        String accessToken = "";
        String refreshToken = "";
        int accessTokenExpirationTime = 60; // 1시간
        int refreshTokenExpirationTime = 7200; // 2시간

        try {
            User user = userRepoService.findByEmail(request.getEmail());
//            if (!user.getActive()) return SignInResponse.loginFail(); // 회원탈퇴 기능 셍기면 추가하기

            String encodedPassword = user.getPassword();
            System.out.println("클라이언트에서 받은 encodedPassword값 : "+encodedPassword);

            // 입력한 비번과 db에 있는 비번이 일치한지 확인
            boolean isMatched = passwordEncoder.matches(request.getPassword(), encodedPassword);
            if (!isMatched) return SignInResponse.loginFail();

            accessToken = jwtSecurity.create(user.getEmail());
            refreshToken = jwtSecurity.createRefreshToken(user.getEmail());
        } catch (NonExistUserException e) {
            System.out.println("NoSuchElementException 실행");
            return SignInResponse.loginFail(); // 사용자 없음 응답
        } catch (Exception e) {
            System.out.println("Exception 실행");
            e.printStackTrace();
            SignInResponse.databaseError();
        }
        return SignInResponse.success(accessToken, refreshToken, accessTokenExpirationTime, refreshTokenExpirationTime);
    }
}
