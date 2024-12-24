package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class DeletePlaylistResponse extends ResponseDto {
    public DeletePlaylistResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<DeletePlaylistResponse> success(){ // 성공
        return ResponseEntity.status(HttpStatus.OK).body(new DeletePlaylistResponse());
    }

    public static ResponseEntity<ResponseDto> fail(){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.BAD_REQUEST, ResponseMessage.BAD_REQUEST));
    }
}
