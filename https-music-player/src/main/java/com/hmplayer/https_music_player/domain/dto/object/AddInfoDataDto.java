package com.hmplayer.https_music_player.domain.dto.object;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class AddInfoDataDto {

    private MusicInfoDataDto basicInfo;
    private int infoDuration;


}
