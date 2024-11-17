package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
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
        System.out.println("서버에서 받아온 getYoutube : " + request.getYoutube());
        System.out.println("서버에서 받아온 getInfoDuration : " + request.getInfoDuration());
        System.out.println("서버에서 받아온 getPlaylistId : " + request.getPlaylistId());
        System.out.println("서버에서 받아온 token : " + token);

        return musicservice.addPlayListToMusic(request,token);
    }



}
