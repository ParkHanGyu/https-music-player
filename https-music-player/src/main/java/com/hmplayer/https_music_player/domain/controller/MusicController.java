package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.MusicLikeRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicLikeResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.UpdateOrderValueResponse;
import com.hmplayer.https_music_player.domain.service.MusicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicservice;

    // 음악 추가
    @PostMapping("/add")
    public ResponseEntity<? super MusicResponse> addPlayListToMusic(@RequestBody AddPlayListToMusicRequest request, @RequestHeader("Authorization") String token) {
        return musicservice.addPlayListToMusic(request,token);
    }


    // 음악 삭제
    @DeleteMapping("/delete/playlist/{playlistId}/musicId/{musicId}")
    public ResponseEntity<? super DeleteMusicResponse> deleteMusic(@PathVariable("playlistId") Long playlistId, @PathVariable("musicId") Long musicId, @AuthenticationPrincipal String email) {
        log.info("playlistId ={} , musicId = {}, email = {}", playlistId, musicId, email);
        return musicservice.deleteMusic(playlistId, musicId, email);
    }


    // 음악 순서 변경
    @PutMapping("/update/order/{playlistId}")
    public ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(@PathVariable("playlistId") Long playlistId, @RequestBody UpdatePlaylistOrderRequest request, @AuthenticationPrincipal String email) {
        log.info("playlistId = {}, request = {}, token = {}", playlistId, request, email);
        return musicservice.updatePlaylistOrder(playlistId, request, email);
    }

    // 음악 좋아요
    @PutMapping("/like")
    public ResponseEntity<? super MusicLikeResponse> musicLike(@RequestBody MusicLikeRequest request, @AuthenticationPrincipal String email) {
        log.info("request = {}, token = {}", request, email);
        return musicservice.musicLike(request, email);
    }

}
