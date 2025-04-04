package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
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
    @DeleteMapping("/delete/{musicId}")
    public ResponseEntity<? super DeleteMusicResponse> deleteMusic(@PathVariable("musicId") Long musicId, @AuthenticationPrincipal String email) {
        return musicservice.deleteMusic(musicId,email);
    }


    // 음악 순서 변경
    @PutMapping("/update/order/{playlistId}")
    public ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(@PathVariable("playlistId") Long playlistId, @RequestBody UpdatePlaylistOrderRequest request, @AuthenticationPrincipal String email) {
        log.info("playlistId = {}, request = {}, token = {}", playlistId, request, email);
        return musicservice.updatePlaylistOrder(playlistId, request, email);
    }


}
