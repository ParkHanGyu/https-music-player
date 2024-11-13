package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
@RequiredArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepoService userRepoService;
//    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Override
    public ResponseEntity<? super SignUpResponse> signUp(SignUpRequest request) {
        try {
            // 중복 회원(이메일)
            Optional<User> findExistingUser = userRepoService.existCheckEmail(request.getEmail());
            if (findExistingUser.isPresent()) return SignUpResponse.existingUser();

//            String password = passwordEncoder.encode(request.getPassword());
            String password = request.getPassword();
            User user = SignUpRequest.of(request, password);
            userRepoService.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return SignUpResponse.databaseError();
        }
        return SignUpResponse.sucess();
    }
}
