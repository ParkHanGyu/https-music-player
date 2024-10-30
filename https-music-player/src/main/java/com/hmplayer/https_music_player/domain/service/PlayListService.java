package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import org.springframework.http.ResponseEntity;

public interface PlayListService {

    ResponseEntity<? super PlayListResponse> addPlayList(AddPlayListRequest request);
}
