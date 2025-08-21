package com.hmplayer.https_music_player.domain.dto.object;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class MusicLikeCountDto {
    private MusicDto musicInfo;
    private long likeCount;

    public MusicLikeCountDto(MusicDto musicInfo, long likeCount) {
        this.musicInfo = musicInfo;
        this.likeCount = likeCount;
    }
}
