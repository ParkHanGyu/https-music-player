package com.hmplayer.https_music_player.domain.dto.response.auth;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class SignUpResponse extends ResponseDto {

    public SignUpResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }
    public static ResponseEntity<SignUpResponse> sucess(){
        return ResponseEntity.status(HttpStatus.OK).body(new SignUpResponse());
    }

    // 중복 회원
    public static ResponseEntity<ResponseDto> existingUser() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.DUPLICATE_EMAIL,ResponseMessage.DUPLICATE_EMAIL));
    }
}
