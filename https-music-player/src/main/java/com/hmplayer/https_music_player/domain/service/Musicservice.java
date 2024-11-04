package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import org.springframework.http.ResponseEntity;

public interface Musicservice {
    ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request);

}
