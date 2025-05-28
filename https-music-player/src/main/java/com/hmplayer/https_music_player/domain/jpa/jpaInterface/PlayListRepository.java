package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayListRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByUserId(Long userId);

    @Query("SELECT p FROM Playlist p WHERE p.user.id = :userId AND p.id = :playlistId")
    Optional<Playlist> findPlaylistByUserAndPlaylistId(@Param("userId") Long userId, @Param("playlistId") Long playlistId);

    @Modifying
    @Query("DELETE FROM Playlist p WHERE p.playlistId = :playlistId")
    void deleteByPlaylistId(@Param("playlistId") Long playlistId);


    boolean existsByPlaylistId(Long playlistId);

    List<Playlist> findAllByPlaylistId(Long playlistId);

    Optional<Playlist> findByPlaylistId(Long playlistId);

}
