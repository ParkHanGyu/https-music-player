package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PlaylistMusicRepository extends JpaRepository<PlaylistMusic, Long> {

    @Query("SELECT pm FROM PlaylistMusic pm " +
            "JOIN pm.playlist pl " +
            "WHERE pl.user.id = :userId AND pm.music.musicId = :musicId")
    Optional<PlaylistMusic> findByUserAndMusicId(@Param("userId") Long userId, @Param("musicId") Long musicId);

    void deleteById(Long playlistMusicId);

    Optional<PlaylistMusic> findById(Long playlistMusicId);


}
