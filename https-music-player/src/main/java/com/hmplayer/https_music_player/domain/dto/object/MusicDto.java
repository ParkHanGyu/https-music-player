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
    private int duration;  // 재생 시간 (초 단위)
    private Date createdAt;  // 생성 날짜
    private boolean like; // like 유무
    private BasicInfoDto basicInfo;


    public MusicDto(Music music, boolean like) {
        this.musicId = music.getMusicId();
        this.duration = music.getDuration();
        this.createdAt = music.getCreatedAt();
        this.like = like;

        this.basicInfo = new BasicInfoDto();
        this.basicInfo.setUrl(music.getUrl());
        this.basicInfo.setImageUrl(music.getImageUrl());
        this.basicInfo.setAuthor(music.getAuthor());
        this.basicInfo.setTitle(music.getTitle());
    }

    public MusicDto of(Music music){
        this.musicId = music.getMusicId();
        this.duration = music.getDuration();
        this.createdAt = music.getCreatedAt();

        this.basicInfo = new BasicInfoDto();
        this.basicInfo.setUrl(music.getUrl());
        this.basicInfo.setImageUrl(music.getImageUrl());
        this.basicInfo.setAuthor(music.getAuthor());
        this.basicInfo.setTitle(music.getTitle());
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
