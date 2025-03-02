package com.hmplayer.https_music_player.domain.dto.request;

import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddPlayListToMusicRequest {
    private MusicInfoDataDto musicInfoData;
    private int infoDuration;
    private Long playlistId;

}
