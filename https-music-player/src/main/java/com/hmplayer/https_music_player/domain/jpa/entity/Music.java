package com.hmplayer.https_music_player.domain.jpa.entity;

import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "music")
@ToString
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "music_id")
    private Long musicId;  // 음악 ID

    @Column(name = "title")
    private String title;  // 음악 제목

    @Column(name = "author")
    private String author;  // 음악 작곡가

    @Column(name = "duration")
    private int duration;  // 재생 시간 (초 단위)

    @Column(name = "url")
    private String url;  // 음악 URL

    @Column(name = "imageUrl")
    private String imageUrl;  // 음악 이미지

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;  // 생성 날짜

    @OneToMany(mappedBy = "music", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PlaylistMusic> playlists;  // 연결된 재생 목록들

    public Music(MusicInfoDataDto youtube, int duration) {
        this.title = youtube.getVidTitle();
        this.author = youtube.getAuthor();
        this.imageUrl = youtube.getThumb();
        this.duration = duration;
        this.url = youtube.getVidUrl();

        this.createdAt = new Date();  // 생성 시 현재 날짜로 초기화
    }

    // Getter for musicId
    public Long getId() {
        return musicId;
    }

}
