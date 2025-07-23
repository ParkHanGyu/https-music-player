package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.jpa.entity.Like;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MusicLikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndMusic(User user, Music music);


//    void save(Long musicId, String userEmail);

}
