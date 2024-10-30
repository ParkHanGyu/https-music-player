package com.hmplayer.https_music_player.domain.jpa.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "playList")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playList_id")
    private Long playlistId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "playList_name")
    private String title;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;
}
