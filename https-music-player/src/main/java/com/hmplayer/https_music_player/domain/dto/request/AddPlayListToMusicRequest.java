package com.hmplayer.https_music_player.domain.dto.request;

import com.hmplayer.https_music_player.domain.dto.object.AddInfoDataDto;
import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@ToString
public class AddPlayListToMusicRequest {
//    private MusicInfoDataDto musicInfoData;
//    private int infoDuration;
//    private Long playlistId;

    private List<AddInfoDataDto> addInfoDataDto;
    private Long playlistId;


}
