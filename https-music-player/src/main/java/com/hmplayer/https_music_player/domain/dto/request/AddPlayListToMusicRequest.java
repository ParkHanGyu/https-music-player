package com.hmplayer.https_music_player.domain.dto.request;

import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class AddPlayListToMusicRequest {
    private MusicInfoDataDto musicInfoData;
    private int infoDuration;
    private Long playlistId;

}
