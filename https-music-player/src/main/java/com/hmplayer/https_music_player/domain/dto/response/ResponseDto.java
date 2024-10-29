package com.hmplayer.https_music_player.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@AllArgsConstructor
@ToString
@Getter
public class ResponseDto {

    private String code;
    private String message;

//    public static ResponseEntity<ResponseDto> databaseError(){
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR));
//    }
}
