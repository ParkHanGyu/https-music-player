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
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.Musicservice;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

}
