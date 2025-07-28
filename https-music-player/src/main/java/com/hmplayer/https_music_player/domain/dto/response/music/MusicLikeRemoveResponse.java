package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class MusicLikeRemoveResponse extends ResponseDto {
    public MusicLikeRemoveResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<MusicLikeRemoveResponse> success() {
        return ResponseEntity.status(HttpStatus.OK).body(new MusicLikeRemoveResponse());
    }

}
