package com.hmplayer.https_music_player.domain.jpa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "playlist_music")
public class PlaylistMusic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_id", nullable = false)
    private Music music;

    @Column(name = "order_value", nullable = false)
    private int orderValue; // 순서 필드 추가

    public PlaylistMusic(Playlist playlist, Music music, int orderValue) {
        this.playlist = playlist;
        this.music = music;
        this.orderValue = orderValue; // 생성 시 순서 지정
    }
}
