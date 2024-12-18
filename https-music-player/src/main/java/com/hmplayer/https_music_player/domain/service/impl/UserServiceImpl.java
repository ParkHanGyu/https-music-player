package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.UserDto;
import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepoService userRepoService;


    @Override // 엑세스 토큰이 있을경우 회원 정보 가져오기
    public ResponseEntity<? super GetLoginUserResponse> getLoginUser(String request) {
        UserDto userDto;
        try{
            User user = userRepoService.findByEmail(request);
            userDto = UserDto.of(user);
        } catch (Exception e){
            e.printStackTrace();
            throw e;
        }

        System.out.println("db에서 데이터 찾고 Dto로 감싼 userDto 값 : "+userDto);
        return GetLoginUserResponse.success(userDto);



//        System.out.println("클라이언트에서 받아온 값 : "+request);
//        return null;
    }


}
