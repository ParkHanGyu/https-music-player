package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.YoutubeDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.MusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.service.MusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlaylistMusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.Musicservice;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicserviceImpl implements Musicservice {
    private final MusicRepoService musicRepoService;
    private final PlayListRepoService playListRepoService;
    private final UserRepoService userRepoService;
    private final JwtSecurity jwtSecurity;
    private final PlaylistMusicRepoService playlistMusicRepoService;



    @Override
    public ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request, String token) {
        String pureToken = token.replace("Bearer ", "").trim();

        jwtSecurity.isValid(pureToken); // 엑세스 토큰 유효하니?

        YoutubeDto youtube = request.getYoutube();
        int infoDuration = request.getInfoDuration();
        Long playlistId = request.getPlaylistId();

        Optional<Playlist> optionalPlaylist = playListRepoService.findById(playlistId);
        if (optionalPlaylist.isEmpty()) {
            return ResponseEntity.badRequest().body(new MusicResponse());
        }

        Playlist playlist = optionalPlaylist.get();

        Music addMusicInfo = new Music(youtube, infoDuration);
        PlaylistMusic playlistMusic = new PlaylistMusic(playlist,addMusicInfo);

        addMusicInfo.setPlaylists(Collections.singletonList(playlistMusic));

        musicRepoService.save(addMusicInfo);

        return MusicResponse.success();
    }

    @Override
    public ResponseEntity<? super MusicResponse> deleteMusic(Long musicId, String email) {
//        String pureToken = token.replace("Bearer ", "").trim();
//        jwtSecurity.isValid(pureToken); // 엑세스 토큰 유효하니?

        User user = userRepoService.findByEmail(email);


        System.out.println("받아온 user 값 : " + user);
                log.info("토큰으로 가져온 user 데이터 : ID = {}, Admin = {}, email = {}, playlist = {}, password = {}, imageUrl = {}",
                        user.getId(), user.getAdmin(), user.getEmail(),user.getPlaylists(),user.getPassword(),user.getImageUrl());



        // 해당 사용자의 Playlist에 해당 Music이 존재하는지 확인
        PlaylistMusic playlistMusic = playlistMusicRepoService.findByUserAndMusicId(user.getId(), musicId)
                .orElseThrow(() -> new IllegalArgumentException("삭제 권한이 없거나 음악이 존재하지 않습니다."));

        System.out.println("db에서 찾아온 데이터 : "+playlistMusic);
        log.info("db에서 찾아온 양쪽 데이터 : music = {}, playlist = {}, id = {}",playlistMusic.getMusic(), playlistMusic.getPlaylist(), playlistMusic.getId());

// 삭제 전
        log.info("삭제할 playlistMusic ID: {}", playlistMusic.getId());
// 삭제 처리
        playlistMusicRepoService.deleteById(playlistMusic.getId());
// 삭제 후 확인
        Optional<PlaylistMusic> deletedPlaylistMusic = playlistMusicRepoService.findById(playlistMusic.getId());
        if (deletedPlaylistMusic.isEmpty()) {
            log.info("playlistMusic ID {}가 정상적으로 삭제되었습니다.", playlistMusic.getId());
        } else {
            log.error("playlistMusic ID {} 삭제 실패", playlistMusic.getId());
        }




        return null;
    }


}
