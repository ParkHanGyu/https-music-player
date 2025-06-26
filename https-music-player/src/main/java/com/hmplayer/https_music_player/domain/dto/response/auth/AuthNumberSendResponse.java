package com.hmplayer.https_music_player.domain.dto.response.auth;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class AuthNumberSendResponse extends ResponseDto {

    private int expireTime; // 인증번호 유효시간


    public AuthNumberSendResponse(int expireTime) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.expireTime = expireTime;
    }

    public static ResponseEntity<AuthNumberSendResponse> success(int expireTime){
        return ResponseEntity.status(HttpStatus.OK).body(new AuthNumberSendResponse(expireTime));
    }

    public static ResponseEntity<ResponseDto> fail(){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.EMAIL_SEND_FAIL, ResponseMessage.EMAIL_SEND_FAIL));
    }
}
