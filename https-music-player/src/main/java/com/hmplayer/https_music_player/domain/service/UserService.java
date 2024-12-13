package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    ResponseEntity<? super GetLoginUserResponse> getLoginUser(String email);

    ResponseEntity<?> uploadFile(MultipartFile file, String email);

}
