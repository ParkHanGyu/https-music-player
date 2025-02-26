package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.UpdateOrderValueResponse;
import org.springframework.http.ResponseEntity;

public interface Musicservice {
    ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request, String email);

    ResponseEntity<? super DeleteMusicResponse> deleteMusic(Long musicId, String token);

    ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(Long playlistId, UpdatePlaylistOrderRequest request, String email);

    }
