package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MusicLikeRepository extends JpaRepository<Like, Long> {


//    void save(Long musicId, String userEmail);

}
