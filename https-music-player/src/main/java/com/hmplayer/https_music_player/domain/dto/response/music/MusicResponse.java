package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
public class MusicResponse extends ResponseDto {

    public MusicResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }
    public static ResponseEntity<MusicResponse> success(){ // 성공
        return ResponseEntity.status(HttpStatus.OK).body(new MusicResponse());
    }
}
