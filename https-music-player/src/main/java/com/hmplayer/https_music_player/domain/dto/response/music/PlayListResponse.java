package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
public class PlayListResponse extends ResponseDto {

    private List<PlayListDto> playlists = new ArrayList<>();


    public PlayListResponse(List<PlayListDto> playlists) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.playlists = playlists;
    }


    public static ResponseEntity<PlayListResponse> success(List<PlayListDto> playlists){
        return ResponseEntity.ok(new PlayListResponse(playlists));
    }
}
