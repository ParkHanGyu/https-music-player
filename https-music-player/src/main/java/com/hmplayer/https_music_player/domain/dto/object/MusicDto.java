package com.hmplayer.https_music_player.domain.dto.object;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
public class MusicDto {

    private Long musicId;  // 음악 ID
    private String title;  // 음악 제목
    private String author;  // 음악 작곡가
    private int duration;  // 재생 시간 (초 단위)
    private String url;  // 음악 URL
    private String imageUrl;  // 음악 이미지
    private Date createdAt;  // 생성 날짜
    private boolean like; // like 유무


    public MusicDto(Music music, boolean like) {
        this.musicId = music.getMusicId();
        this.title = music.getTitle();
        this.author = music.getAuthor();
        this.duration = music.getDuration();
        this.url = music.getUrl();
        this.imageUrl = music.getImageUrl();
        this.createdAt = music.getCreatedAt();
        this.like = like;
    }

    public MusicDto of(Music music){
        this.musicId = music.getMusicId();
        this.title = music.getTitle();
        this.author = music.getAuthor();
        this.duration = music.getDuration();
        this.url = music.getUrl();
        this.imageUrl = music.getImageUrl();
        this.createdAt = music.getCreatedAt();
        return this;
    }

    public void setLiked(boolean like) {
        this.like = like;
    }

//    public static List<MusicDto> ofList(List<Music> Musics){
//        List<MusicDto> result = new ArrayList<>();
//        for (Music music : Musics) {
//            result.add(new MusicDto().of(music));
//        }
//        return result;
//    }


}
