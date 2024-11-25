package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MusicRepository extends JpaRepository<Music, Long> {

    @Modifying
    @Query("DELETE FROM Music m WHERE m.id = :musicId")
    void deleteByMusicId(@Param("musicId") Long musicId);
}


