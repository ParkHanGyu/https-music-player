package com.hmplayer.https_music_player.domain.dto.object;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class MusicLikeCountDto {

    private Long musicId;
    private String title;
    private String author;
    private int duration;
    private String url;
    private String imageUrl;
    private Date createdAt;
    private long likeCount;


    public MusicLikeCountDto(Long musicId, String title, String author, int duration, String url, String imageUrl, Date createdAt, long likeCount ){
        this.musicId = musicId;
        this.title = title;
        this.author = author;
        this.duration = duration;
        this.url = url;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
    }
}
