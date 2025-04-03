package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class UpdateOrderValueResponse extends ResponseDto {

    public UpdateOrderValueResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

//    public static ResponseEntity<UpdateOrderValueResponse> success(){ // 성공
//        return ResponseEntity.status(HttpStatus.OK).body(new UpdateOrderValueResponse());
//    }

    public static ResponseEntity<ResponseDto> success() { // 성공 응답
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(ResponseCode.SUCCESS, ResponseMessage.SUCCESS));
    }
}
