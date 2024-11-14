package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import org.springframework.http.ResponseEntity;

public interface UserService {

    ResponseEntity<? super GetLoginUserResponse> getLoginUser(String email);
}
