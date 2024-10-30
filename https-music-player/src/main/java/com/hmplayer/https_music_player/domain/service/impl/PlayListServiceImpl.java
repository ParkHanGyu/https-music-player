package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoSerivce;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayListServiceImpl implements PlayListService {
    private final PlayListRepoSerivce playListRepoSerivce;

    @Override
    public ResponseEntity<? super PlayListResponse> addPlayList(AddPlayListRequest request){

        return null;
    }

}
