package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.UserDto;
import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepoService userRepoService;


    @Override // 로그인을 하면 가져올 데이터
    public ResponseEntity<? super GetLoginUserResponse> getLoginUser(String email) {
        UserDto userDto;
        try{
            User user = userRepoService.findByEmail(email);
            userDto = UserDto.of(user);
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }
        return GetLoginUserResponse.success(userDto);
    }
}
