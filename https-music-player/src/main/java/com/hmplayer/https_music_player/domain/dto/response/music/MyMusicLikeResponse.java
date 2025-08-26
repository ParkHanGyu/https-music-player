package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
public class MyMusicLikeResponse extends ResponseDto {

    private List<MusicDto> musicList = new ArrayList<>();

    public MyMusicLikeResponse(List<MusicDto> musicList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.musicList = musicList;
    }
    public static ResponseEntity<MyMusicLikeResponse> success(List<MusicDto> musicList){
        return ResponseEntity.ok(new MyMusicLikeResponse(musicList));
    }
}
