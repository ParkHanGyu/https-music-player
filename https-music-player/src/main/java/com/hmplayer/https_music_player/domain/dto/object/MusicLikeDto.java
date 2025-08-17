package com.hmplayer.https_music_player.domain.dto.object;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class MusicLikeDto {

    private Long musicId;
    private String title;
    private String author;
    private int duration;
    private String url;
    private String imageUrl;
    private Date createdAt;
    private long likeCount;
    private boolean liked;

    public MusicLikeDto(Long musicId, String title, String author, int duration, String url, String imageUrl, Date createdAt) {
        this.musicId = musicId;
        this.title = title;
        this.author = author;
        this.duration = duration;
        this.url = url;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.liked = false;
    }
}
