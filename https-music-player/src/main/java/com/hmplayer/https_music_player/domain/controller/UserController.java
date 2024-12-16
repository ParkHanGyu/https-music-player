package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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


    @PostMapping("/upload/profile") // 프로필 이미지 변경
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal String email) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        return userService.uploadFile(file, email);
    }
}
