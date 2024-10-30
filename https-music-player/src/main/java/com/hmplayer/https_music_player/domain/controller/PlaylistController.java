package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api")
public class PlaylistController {

    @PostMapping("/add/playList")
    public ResponseEntity<? super PlayListResponse> addPlayList(@RequestBody AddPlayListRequest request) {
        System.out.println("서버에서 받아온 playListName : " + request.getPlayListName());
        System.out.println("서버에서 받아온 user : " + request.getUser());
        return null;
    }
}
