package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
public class GetMusicResponse extends ResponseDto {
    private List<MusicDto> musicList = new ArrayList<>();

    public GetMusicResponse(List<MusicDto> musicList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.musicList = musicList;
    }
    public static ResponseEntity<GetMusicResponse> success(List<MusicDto> musicList){
        return ResponseEntity.ok(new GetMusicResponse(musicList));
    }

}
