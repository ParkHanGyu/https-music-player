package com.hmplayer.https_music_player.domain.jpa.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "playList")
public class Playlist extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playList_id")
    private Long playlistId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "playList_name")
    private String title;



    public Playlist(String userName, String playListName) {
        this.userName = userName;
        this.title = playListName;
    }
}
