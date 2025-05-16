package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignInResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.dto.response.auth.accessTokenReissueResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;
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
        int accessTokenExpirationTime = 0;
        int refreshTokenExpirationTime = 0;

        try {
            User user = userRepoService.findByEmail(request.getEmail());
//            if (!user.getActive()) return SignInResponse.loginFail(); // 회원탈퇴 기능 생기면 추가하기

            String encodedPassword = user.getPassword();
            System.out.println("클라이언트에서 받은 encodedPassword값 : "+encodedPassword);

            // 입력한 비번과 db에 있는 비번이 일치한지 확인
            boolean isMatched = passwordEncoder.matches(request.getPassword(), encodedPassword);
            if (!isMatched) return SignInResponse.loginFail();

            accessToken = jwtSecurity.createAccessToken(user.getEmail());
            refreshToken = jwtSecurity.createRefreshToken(user.getEmail());


            accessTokenExpirationTime = jwtSecurity.extractExpiration(accessToken);
            refreshTokenExpirationTime = jwtSecurity.extractExpiration(refreshToken);

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




    @Override
    public ResponseEntity<? super accessTokenReissueResponse> refreshAccessToken(String token) {
        int newAccessTokenExpirationTime = 0;
// 1. "Bearer " 접두사 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            // 2. 이메일 추출 + 검증
            String email = jwtSecurity.validate(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid refresh token payload.");
            }

            // 3. 새 액세스 토큰 생성
            String newAccessToken = jwtSecurity.createAccessToken(email);

            System.out.println("원래 token : " + token);
            System.out.println("새로운 Token : " + newAccessToken);

            // + 토큰 유효시간 추출
            newAccessTokenExpirationTime = jwtSecurity.extractExpiration(newAccessToken);

            System.out.println("클라이언트에 보낼 데이터 : " + new accessTokenReissueResponse(newAccessToken, newAccessTokenExpirationTime));

            // 4. 응답 생성
            return accessTokenReissueResponse.success(newAccessToken, newAccessTokenExpirationTime);
//            return null;

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error refreshing access token.");
        }
    }


}
