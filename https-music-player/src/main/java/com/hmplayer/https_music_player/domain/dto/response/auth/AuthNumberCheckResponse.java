package com.hmplayer.https_music_player.domain.dto.response.auth;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class AuthNumberCheckResponse extends ResponseDto {

    public AuthNumberCheckResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<AuthNumberCheckResponse> success(){
        return ResponseEntity.status(HttpStatus.OK).body(new AuthNumberCheckResponse());
    }

    public static ResponseEntity<ResponseDto> fail(){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.EMAIL_SEND_FAIL, ResponseMessage.EMAIL_SEND_FAIL));
    }
}
