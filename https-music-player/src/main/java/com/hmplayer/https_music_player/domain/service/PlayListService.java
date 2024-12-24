package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.DeletePlaylistResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.GetMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public interface PlayListService {

    ResponseEntity<? super PlayListResponse> createPlayList(AddPlayListRequest request, String email);

    ResponseEntity<? super PlayListResponse> getPlayListLibrary(String email);

    ResponseEntity<? super GetMusicResponse> getPlayList(Long playlistId);

    ResponseEntity<? super DeletePlaylistResponse> deletePlaylist(Long playlistId, String email);


}
