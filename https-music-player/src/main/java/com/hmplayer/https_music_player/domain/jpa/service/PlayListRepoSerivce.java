package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
@Slf4j
public class PlayListRepoSerivce {
    private final PlayListRepository playListRepository;

    @Transactional
    public void save(Playlist playlist) {
        playListRepository.save(playlist);
        log.info("저장된 데이터: 생성일 = {}, ID = {}, 제목 = {}, 사용자 = {}",
                playlist.getCreateDate(), playlist.getPlaylistId(),
                playlist.getTitle(), playlist.getUserName());
    }

    public List<Playlist> findListByName(String userName) {
        log.info("찾는 데이터 : 이름 = {}",
                userName);
        return playListRepository.findListByName(userName);
    }



}
