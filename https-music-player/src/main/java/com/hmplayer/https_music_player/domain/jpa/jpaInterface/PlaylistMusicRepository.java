package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface PlaylistMusicRepository extends JpaRepository<PlaylistMusic, Long> {



//    @Modifying
//    @Query("DELETE FROM PlaylistMusic pm WHERE pm.playlist.id = :playlistId AND pm.music.id = :musicId AND pm.playlist.user.id = :userId")
//    int deleteByPlaylistIdAndMusicIdAndUserId(@Param("playlistId") Long playlistId, @Param("musicId") Long musicId, @Param("userId") Long userId);

    Optional<PlaylistMusic> findByPlaylist_PlaylistIdAndMusic_MusicId(Long playlistId, Long musicId);

    @Modifying
    void deleteByPlaylist_PlaylistIdAndMusic_MusicId(Long playlistId, Long musicId);

    boolean existsByMusic_MusicId(Long musicId);


    @Query("SELECT pm FROM PlaylistMusic pm " +
            "JOIN pm.playlist pl " +
            "WHERE pl.user.id = :userId AND pm.music.musicId = :musicId")
    Optional<PlaylistMusic> findByUserAndMusicId(@Param("userId") Long userId, @Param("musicId") Long musicId);

    void deleteById(Long playlistMusicId);

    Optional<PlaylistMusic> findById(Long playlistMusicId);

    @Modifying
    @Query("DELETE FROM PlaylistMusic pm WHERE pm.playlist.user.id = :userId AND pm.music.id = :musicId")
    void deletePlaylistMusicByUserAndMusicId(@Param("userId") Long userId, @Param("musicId") Long musicId);


    @Query("SELECT pm FROM PlaylistMusic pm " +
            "JOIN pm.playlist p " +
            "JOIN pm.music m " +
            "WHERE p.playlistId = :playlistId " +
            "AND m.url = :musicUrl")
    Optional<PlaylistMusic> findByPlaylistIdAndMusicUrl(
            @Param("playlistId") Long playlistId,
            @Param("musicUrl") String musicUrl);

    @Modifying
    @Query("DELETE FROM PlaylistMusic pm WHERE pm.playlist.playlistId = :playlistId")
    void deleteByPlaylistId(@Param("playlistId") Long playlistId);

    @Query("SELECT pm FROM PlaylistMusic pm WHERE pm.playlist.id = :playlistId ORDER BY pm.orderValue")
    List<PlaylistMusic> findByPlaylistIdOrderByOrderValue(@Param("playlistId") Long playlistId);

    boolean existsByMusic_MusicIdAndPlaylist_PlaylistId(Long musicId, Long playlistId);

//    @Query("SELECT MAX(pm.orderValue) FROM PlaylistMusic pm")
//    Optional<Integer> findMaxOrderValueGlobally();

    @Query("SELECT MAX(pm.orderValue) FROM PlaylistMusic pm WHERE pm.playlist.id = :playlistId")
    Optional<Integer> findMaxOrderValueByPlaylistId(@Param("playlistId") Long playlistId);
}
