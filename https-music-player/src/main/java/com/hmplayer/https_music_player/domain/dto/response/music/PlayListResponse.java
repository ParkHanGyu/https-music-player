package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class PlayListResponse extends ResponseDto {

    public PlayListResponse(String code, String message) {
        super(code, message);
    }


//    public static PlayListResponse success(String code, String message) {
//        return new BoardListResponse();
//    }
}
