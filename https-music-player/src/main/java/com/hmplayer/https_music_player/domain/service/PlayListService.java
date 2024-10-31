package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

public interface PlayListService {

    ResponseEntity<? super PlayListResponse> addPlayList(AddPlayListRequest request);

    ResponseEntity<? super PlayListResponse> getPlayList( String userName);
}
