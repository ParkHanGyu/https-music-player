package com.hmplayer.https_music_player.domain.jpa.jpaInterface;

import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.object.MusicLikeCountDto;
import com.hmplayer.https_music_player.domain.jpa.entity.Like;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MusicLikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndMusic(User user, Music music);

    Optional<Like> findByUserAndMusic(User user, Music music);


    @Query("SELECT new com.hmplayer.https_music_player.domain.dto.object.MusicLikeCountDto(" +
            "new com.hmplayer.https_music_player.domain.dto.object.MusicDto(m, false), COUNT(l)) " +
            "FROM Music m LEFT JOIN Like l ON l.music = m " +
            "GROUP BY m " +
            "ORDER BY COUNT(l) DESC, MIN(l.id) ASC")
    List<MusicLikeCountDto> findMusicWithLikeCount();


    @Query("SELECT l.music.musicId FROM Like l WHERE l.user.email = :email")
    List<Long> findMusicIdsByUserEmail(@Param("email") String email);

    
    
    // db에 있는 모든 music중 특정 user가 like 하고 있는 데이터 get
    @Query("SELECT new com.hmplayer.https_music_player.domain.dto.object.MusicDto(m, true) " +
            "FROM Music m " +
            "JOIN Like l ON l.music = m AND l.user.email = :email " +
            "ORDER BY l.id ASC")
    List<MusicDto> findMyLikedMusic(@Param("email") String email);



}
