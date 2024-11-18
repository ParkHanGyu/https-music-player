package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/get-info") // 토큰 확인해서 회원 정보 가져오기
    public ResponseEntity<? super GetLoginUserResponse> getLoginUser(@AuthenticationPrincipal String request){
        System.out.println("받아온 데이터 : "+ request);
        return userService.getLoginUser(request);
    }
}
