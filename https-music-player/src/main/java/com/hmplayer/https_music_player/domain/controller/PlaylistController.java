package com.hmplayer.https_music_player.domain.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api")
public class PlaylistController {

    @PostMapping("/add/playList")
    public ResponseEntity<?> addPlayList(String playListName, String user ) {
        System.out.println("서버에서 받아온 playListName : " + playListName);
        System.out.println("서버에서 받아온 user : " + user);
        return null;
    }
}
