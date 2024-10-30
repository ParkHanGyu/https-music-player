package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayListRepository extends JpaRepository<Playlist, Long> {
}
