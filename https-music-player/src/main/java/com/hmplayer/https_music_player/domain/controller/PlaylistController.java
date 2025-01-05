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
@RequestMapping("/api")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlayListService playListService;

    // 재생목록 생성(add에서 create로 바꾸기)
    @PostMapping("/create/playList")
    public ResponseEntity<? super PlayListResponse> createPlayList(@RequestBody AddPlayListRequest request, @AuthenticationPrincipal String email) {
        System.out.println("createPlayList 서버에서 받아온 playListName : " + request.getPlayListName());
        System.out.println("서버에서 받아온 user : " + email);
        return playListService.createPlayList(request, email);
    }

    // 재생목록 라이브러리 불러오기
    @GetMapping("/get/playList")
    public ResponseEntity<? super PlayListResponse> getPlayListLibrary(@AuthenticationPrincipal String email) {
            System.out.println("getPlayListLibrary 서버에서 받아온 playListName : " + email);
            return playListService.getPlayListLibrary(email);
    }

    // 재생목록에 있는 노래 불러오기
    @GetMapping("/playList/{playlistId}")
    public ResponseEntity<? super GetMusicResponse> getPlayList(@PathVariable("playlistId") Long playlistId) {
        System.out.println("서버에서 받아온 playlistId : " + playlistId);
        System.out.println("서버에서 받아온 playListService.getPlayList(userName) : " + playListService.getPlayList(playlistId));
        return playListService.getPlayList(playlistId);
    }


    // 재생목록 삭제
    @DeleteMapping("/delete/playlist/{playlistId}")
    public ResponseEntity<? super DeletePlaylistResponse> deletePlaylist(@PathVariable("playlistId") Long playlistId, @AuthenticationPrincipal String email) {
        return playListService.deletePlaylist(playlistId,email);
    }


    // 재생목록 순서 변경
    @PutMapping("/update/playlist/{modifyPlaylistId}")
    public ResponseEntity<? super UpdatePlaylistNameResponse> updatePlaylistName(@PathVariable("modifyPlaylistId") Long modifyPlaylistId, @RequestBody UpdatePlaylistNameRequest request, @AuthenticationPrincipal String email) {
        log.info("musicId = {}, request = {}, token = {}", modifyPlaylistId, request, email);
        return playListService.updatePlaylistName(modifyPlaylistId, request, email);
    }


}
