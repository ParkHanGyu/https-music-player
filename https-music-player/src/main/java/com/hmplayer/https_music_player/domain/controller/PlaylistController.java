package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlayListService playListService;

    // 재생목록 생성(add에서 create로 바꾸기)
    @PostMapping("/add/playList")
    public ResponseEntity<? super PlayListResponse> addPlayList(@RequestBody AddPlayListRequest request) {
        System.out.println("서버에서 받아온 playListName : " + request.getPlayListName());
        System.out.println("서버에서 받아온 user : " + request.getUserName());
        return playListService.addPlayList(request);
    }

    // 재생목록 불러오기
//    @GetMapping("/playList/{userName}")
    @GetMapping("/playList")
    public ResponseEntity<? super PlayListResponse> getPlayList(@RequestParam("userName") String userName) {
        System.out.println("서버에서 받아온 playListName : " + userName);
        return playListService.getPlayList(userName);
    }



}
