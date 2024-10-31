package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlayListRepository extends JpaRepository<Playlist, Long> {

    @Query("SELECT c FROM Playlist c WHERE c.userName = :userName")
    List<Playlist> findListByName(@Param("userName") String userName);
}
