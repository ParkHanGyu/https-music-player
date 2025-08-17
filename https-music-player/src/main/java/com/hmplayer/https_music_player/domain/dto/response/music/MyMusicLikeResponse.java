package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.MusicLikeCountDto;
import com.hmplayer.https_music_player.domain.dto.object.MusicLikeDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
public class MyMusicLikeResponse extends ResponseDto {

    private List<MusicLikeDto> musicList = new ArrayList<>();

    public MyMusicLikeResponse(List<MusicLikeDto> musicList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.musicList = musicList;
    }
    public static ResponseEntity<MyMusicLikeResponse> success(List<MusicLikeDto> musicList){
        return ResponseEntity.ok(new MyMusicLikeResponse(musicList));
    }
}
