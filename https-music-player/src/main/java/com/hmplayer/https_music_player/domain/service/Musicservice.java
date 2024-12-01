package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.CopyMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

public interface Musicservice {
    ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request, String email);

    ResponseEntity<? super DeleteMusicResponse> deleteMusic(Long musicId, String token);


    ResponseEntity<? super CopyMusicResponse> copyMusic(Long musicId, String email);
}
