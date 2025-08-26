package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.object.MusicLikeCountDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
public class MusicLikeRankResponse extends ResponseDto {

    private List<MusicLikeCountDto> musicList = new ArrayList<>();

    public MusicLikeRankResponse(List<MusicLikeCountDto> musicList) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.musicList = musicList;
    }
    public static ResponseEntity<MusicLikeRankResponse> success(List<MusicLikeCountDto> musicList){
        System.out.println("클라이언트에 보내는 musicList 값 : " + musicList);
        return ResponseEntity.ok(new MusicLikeRankResponse(musicList));
    }



}
