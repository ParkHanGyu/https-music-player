package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class PlayListRepoSerivce {
    private final PlayListRepository playListRepository;


}
