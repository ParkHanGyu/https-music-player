package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistNameRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.CopyMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.UpdateOrderValueResponse;
import com.hmplayer.https_music_player.domain.dto.response.playlist.UpdatePlaylistNameResponse;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.Musicservice;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MusicController {

    private final Musicservice musicservice;

    // 재생목록에 음악 추가
    @PostMapping("/add/playList_to_music")
    public ResponseEntity<? super MusicResponse> addPlayListToMusic(@RequestBody AddPlayListToMusicRequest request, @RequestHeader("Authorization") String token) {
        return musicservice.addPlayListToMusic(request,token);
    }


    // 음악 삭제
    @DeleteMapping("/delete/music/{musicId}")
    public ResponseEntity<? super DeleteMusicResponse> deleteMusic(@PathVariable("musicId") Long musicId, @AuthenticationPrincipal String email) {
        return musicservice.deleteMusic(musicId,email);
    }


    // 재생목록 순서 변경
    @PutMapping("/update/order/playlist/{playlistId}")
    public ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(@PathVariable("playlistId") Long playlistId, @RequestBody UpdatePlaylistOrderRequest request, @AuthenticationPrincipal String email) {
        log.info("playlistId = {}, request = {}, token = {}", playlistId, request, email);
        return musicservice.updatePlaylistOrder(playlistId, request, email);
    }


}
