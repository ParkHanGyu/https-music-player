package com.hmplayer.https_music_player.domain.dto.object;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MusicInfoDataDto {
    private String vidUrl;
    private String author;
    private String thumb;
    private String vidTitle;
}
