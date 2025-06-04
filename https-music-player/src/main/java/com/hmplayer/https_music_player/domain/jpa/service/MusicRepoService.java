package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.MusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlaylistMusicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
@Slf4j
public class MusicRepoService {
    private final MusicRepository musicRepository;
    private final PlaylistMusicRepository playlistMusicRepository;

    @Transactional
    public void deleteMusicsByIds(List<Long> musicIds) {
        musicRepository.deleteMusicsByIds(musicIds);
    }

    @Transactional
    public void deleteMusicIfOrphaned(Long musicId) {
        // 해당 musicId를 가진 PlaylistMusic 데이터가 하나도 존재하지 않는지 확인
        boolean isOrphan = !playlistMusicRepository.existsByMusic_MusicId(musicId);
        if (isOrphan) {
            log.info("Music ID {} is orphaned. Deleting from Music table.", musicId);
            musicRepository.deleteById(musicId); // JpaRepository의 기본 deleteById 사용
        }
    }

}
