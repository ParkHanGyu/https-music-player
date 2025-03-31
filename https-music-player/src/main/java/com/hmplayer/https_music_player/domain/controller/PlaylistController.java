package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistNameRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.*;
import com.hmplayer.https_music_player.domain.dto.response.playlist.UpdatePlaylistNameResponse;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/playlist")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlayListService playListService;

    // 재생목록 생성
    @PostMapping("/create")
    public ResponseEntity<? super PlayListResponse> createPlayList(@RequestBody AddPlayListRequest request, @AuthenticationPrincipal String email) {
        return playListService.createPlayList(request, email);
    }

    // 재생목록들 불러오기
    @GetMapping("/get")
    public ResponseEntity<? super PlayListResponse> getPlayListLibrary(@AuthenticationPrincipal String email) {
        return playListService.getPlayListLibrary(email);
    }

    // 재생목록에 있는 노래 불러오기
    @GetMapping("/{playlistId}/musics")
    public ResponseEntity<? super GetMusicResponse> getPlayList(@PathVariable("playlistId") Long playlistId, @RequestHeader("Authorization") String token) {
        return playListService.getPlayList(playlistId);
    }


    // 재생목록 삭제
    @DeleteMapping("/delete/{playlistId}")
    public ResponseEntity<? super DeletePlaylistResponse> deletePlaylist(@PathVariable("playlistId") Long playlistId, @AuthenticationPrincipal String email) {
        return playListService.deletePlaylist(playlistId,email);
    }


    // 재생목록 이름 변경
    @PutMapping("/update/{modifyPlaylistId}")
    public ResponseEntity<? super UpdatePlaylistNameResponse> updatePlaylistName(@PathVariable("modifyPlaylistId") Long modifyPlaylistId, @RequestBody UpdatePlaylistNameRequest request, @AuthenticationPrincipal String email) {
        return playListService.updatePlaylistName(modifyPlaylistId, request, email);
    }


}
