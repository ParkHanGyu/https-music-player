package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
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
public class PlayListRepoService {
    private final PlayListRepository playListRepository;

    @Transactional
    public Optional<Playlist> findById(Long playlistId) {
        return playListRepository.findById(playlistId);
    }

    @Transactional
    public void save(Playlist playlist) {
        playListRepository.save(playlist);
    }




    @Transactional
    public Optional<Playlist> findPlaylistByUserAndPlaylistId(Long userId, Long playlistId){
        return playListRepository.findPlaylistByUserAndPlaylistId(userId, playlistId);
    }


    public List<Playlist> findByUserId(Long userId) {
        return playListRepository.findByUserId(userId);
    }



    @Transactional
    public void deleteByPlaylistId(Long playlistId){
        playListRepository.deleteByPlaylistId(playlistId);
    }
}
