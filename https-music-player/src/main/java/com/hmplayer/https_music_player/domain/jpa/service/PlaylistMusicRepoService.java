package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.MusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlaylistMusicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
@Slf4j
public class PlaylistMusicRepoService {

    private final PlaylistMusicRepository playlistMusicRepository;

    @Transactional
    public Optional<PlaylistMusic> findByUserAndMusicId(Long id, Long musicId) {
        return playlistMusicRepository.findByUserAndMusicId(id,musicId);
    }

    @Transactional
    public void deleteById(long playlistMusicId) {
        try {
            // 삭제 전 확인
            Optional<PlaylistMusic> playlistMusic = playlistMusicRepository.findById(playlistMusicId);
            if (playlistMusic.isEmpty()) {
                log.error("playlistMusic ID {}가 존재하지 않습니다.", playlistMusicId);
                return;
            }

            log.info("삭제할 playlistMusic ID: {}", playlistMusicId);
            playlistMusicRepository.deleteById(playlistMusicId);
            playlistMusicRepository.flush();  // 즉시 DB에 반영

            // 삭제 후 확인
            Optional<PlaylistMusic> deletedPlaylistMusic = playlistMusicRepository.findById(playlistMusicId);
            if (deletedPlaylistMusic.isEmpty()) {
                log.info("playlistMusic ID {}가 정상적으로 삭제되었습니다.", playlistMusicId);
            } else {
                log.error("playlistMusic ID {} 삭제 실패", playlistMusicId);
            }
        } catch (Exception e) {
            log.error("playlistMusic ID {} 삭제 실패: {}", playlistMusicId, e.getMessage());
            throw e; // 예외를 던져서 트랜잭션 롤백
        }
    }


    @Transactional
    public Optional<PlaylistMusic> findById(long playlistMusicId) {
        return playlistMusicRepository.findById(playlistMusicId);
    }

    @Transactional
    public void deletePlaylistMusicByUserAndMusicId(Long userId, Long musicId) {
        // music_id로 playlist_music 데이터 삭제
        playlistMusicRepository.deletePlaylistMusicByUserAndMusicId(userId, musicId);
        log.info("db에서 쿼리에 사용할 데이터 : userId = {}, musicId = {}", userId,musicId);
    }



    @Transactional
    public Optional<PlaylistMusic> findByPlaylistIdAndMusicUrl(Long playlistId, String vidUrl) {
        return playlistMusicRepository.findByPlaylistIdAndMusicUrl(playlistId,vidUrl);
    }

}
