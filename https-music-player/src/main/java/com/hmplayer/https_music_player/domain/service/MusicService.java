package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.MusicLikeRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

public interface MusicService {
    ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request, String token);
    ResponseEntity<? super MusicResponse> addExistingMusicsToPlaylist(AddPlayListToMusicRequest request, String token);

    ResponseEntity<? super DeleteMusicResponse> deleteMusic(Long playlistId, Long musicId, String token);

    ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(Long playlistId, UpdatePlaylistOrderRequest request, String email);

    ResponseEntity<? super MusicLikeResponse> musicLike(MusicLikeRequest request, String email);

    ResponseEntity<? super MusicLikeRemoveResponse> musicLikeRemove(String musicUrl, String email);

    ResponseEntity<? super MusicLikeRankResponse> musicLikeRank(String email);

    ResponseEntity<? super TargetMusicLikeStateResponse> targetMusicLikeState(String targetUrl,String email);

    ResponseEntity<? super MyMusicLikeResponse> myLikeMusic(String email);


}
