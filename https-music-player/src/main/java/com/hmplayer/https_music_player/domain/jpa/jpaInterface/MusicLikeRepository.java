package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.dto.object.MusicLikeCountDto;
import com.hmplayer.https_music_player.domain.jpa.entity.Like;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MusicLikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndMusic(User user, Music music);

    Optional<Like> findByUserAndMusic(User user, Music music);


//    void save(Long musicId, String userEmail);
    @Query("SELECT new com.hmplayer.https_music_player.domain.dto.object.MusicLikeCountDto(" +
            "m.musicId, m.title, m.author, m.duration, m.url, m.imageUrl, m.createdAt, COUNT(l)) " +
            "FROM Music m LEFT JOIN Like l ON l.music = m " +
            "GROUP BY m.musicId, m.title, m.author, m.duration, m.url, m.imageUrl, m.createdAt " +
            "ORDER BY COUNT(l) DESC, MIN(l.id) ASC")
    List<MusicLikeCountDto> findMusicWithLikeCount();



}
