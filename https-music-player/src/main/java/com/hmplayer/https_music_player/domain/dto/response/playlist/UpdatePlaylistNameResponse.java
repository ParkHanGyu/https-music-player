package com.hmplayer.https_music_player.domain.dto.response.playlist;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class UpdatePlaylistNameResponse extends ResponseDto {

    public UpdatePlaylistNameResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }
    public static ResponseEntity<UpdatePlaylistNameResponse> success(){ // 성공
        return ResponseEntity.status(HttpStatus.OK).body(new UpdatePlaylistNameResponse());
    }

    public static ResponseEntity<ResponseDto> existingMusic() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.DUPLICATE_MUSIC,ResponseMessage.DUPLICATE_MUSIC));
    }
}
