package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.MusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
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

    @Transactional
    public void save(Music playlist) {
        musicRepository.save(playlist);
    }

    @Transactional
    public void deleteByMusicId(Long musicId) {
        musicRepository.deleteByMusicId(musicId);
    }

    @Transactional
    public void deleteMusicsByIds(List<Long> musicIds) {
        musicRepository.deleteMusicsByIds(musicIds);
    }

}
