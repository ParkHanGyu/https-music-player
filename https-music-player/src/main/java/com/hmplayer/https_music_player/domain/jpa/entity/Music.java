package com.hmplayer.https_music_player.domain.jpa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "music")
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

    @ManyToOne(fetch = FetchType.LAZY)  // 재생 목록과의 다대일 관계
    @JoinColumn(name = "playlist_id", nullable = false)
    private List<Playlist> playlist;  // 해당 음악이 포함된 재생 목록

    public Music(String title, String author, String imageUrl, int duration, String url, List<Playlist> playlist) {
        this.title = title;
        this.author = author;
        this.imageUrl = imageUrl;
        this.duration = duration;
        this.url = url;
        this.playlist = playlist;

        this.createdAt = new Date();  // 생성 시 현재 날짜로 초기화
    }
}
