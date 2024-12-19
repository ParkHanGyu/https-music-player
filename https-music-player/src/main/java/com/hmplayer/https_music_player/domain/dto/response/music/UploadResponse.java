package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.UserDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class UploadResponse extends ResponseDto {

    private String url;

    public UploadResponse(String url) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.url = url;
    }


    public static ResponseEntity<UploadResponse> success(String url) {
        UploadResponse response = new UploadResponse(url);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }



    public static ResponseEntity<ResponseDto> noExistedUser(){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.NON_EXISTED_USER, ResponseMessage.NON_EXISTED_USER));
    }
}
