package com.hmplayer.https_music_player.domain.dto.request;

import com.hmplayer.https_music_player.domain.dto.object.YoutubeDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class AddPlayListToMusicRequest {
    private String userName;
    private YoutubeDto youtube;
    private int infoDuration;
    private Long playlistId;

}
