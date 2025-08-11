package com.hmplayer.https_music_player.domain.dto.request;

import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MusicLikeRequest {
//    private Long musicId;
//    private String playBarUrl;

    private MusicInfoDataDto musicInfoData;
    private int infoDuration;

}
