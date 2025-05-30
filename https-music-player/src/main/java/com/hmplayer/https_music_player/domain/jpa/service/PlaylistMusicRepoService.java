package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.MusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlaylistMusicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
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

    @Transactional
    public void deleteByPlaylistId(Long playlistId) {
        // music_id로 playlist_music 데이터 삭제
        playlistMusicRepository.deleteByPlaylistId(playlistId);
        log.info("db에서 쿼리에 사용할 데이터 : playlistId = {}", playlistId);
    }

    @Transactional
    public List<PlaylistMusic> findByPlaylistIdOrderByOrderValue(Long playlistId) {
        return playlistMusicRepository.findByPlaylistIdOrderByOrderValue(playlistId);
    }

    @Transactional
    public void save(PlaylistMusic playlistMusic) {
        playlistMusicRepository.save(playlistMusic);
        log.info("저장된 데이터: getMusicId = {}, getPlaylist = {}, getId = {}, getMusic = {}, getOrderValue = {}",playlistMusic.getMusicId(),
                playlistMusic.getPlaylist(),playlistMusic.getId(),
                playlistMusic.getMusic(),playlistMusic.getOrderValue());
    }

    @Transactional
    public void updatePlaylist(List<PlaylistMusic> playlistMusics) {
        playlistMusicRepository.saveAll(playlistMusics);
    }

    @Transactional
    public void deleteByPlaylist_PlaylistIdAndMusic_MusicId(Long playlistId, Long musicId) {
        playlistMusicRepository.deleteByPlaylist_PlaylistIdAndMusic_MusicId(playlistId, musicId);
    }


    @Transactional
    public void reorderAndSavePlaylist(List<PlaylistMusic> playlistMusics) {
        // 1. 전달받은 리스트를 orderValue 기준으로 정렬
        playlistMusics.sort(Comparator.comparingInt(PlaylistMusic::getOrderValue));

        // 2. 순서 값을 10부터 시작하여 10씩 증가시키며 재할당
        int orderValue = 10;
        log.info("=== 재배치 시작 ===");
        for (PlaylistMusic pm : playlistMusics) {
            pm.setOrderValue(orderValue);
            log.info("Music ID: {}, New OrderValue: {}", pm.getMusicId(), orderValue);
            orderValue += 10;
        }

        // 3. 변경된 모든 데이터를 한번에 저장 (JPA의 변경 감지(dirty checking)가 처리)
        playlistMusicRepository.saveAll(playlistMusics);
        log.info("=== 재배치 완료 ===");
    }
}
