package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.service.MusicRepoService;
import com.hmplayer.https_music_player.domain.service.Musicservice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicserviceImpl implements Musicservice {
    private final MusicRepoService musicRepoService;
    private final PlayListRepository playListRepository;


    @Override
    public ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request){

        Long playlistId = request.getPlaylistId();
        int infoDuration =  request.getInfoDuration();
        String vidUrl = request.getYoutube().getVidUrl();
        String author = request.getYoutube().getAuthor();
        String thumb = request.getYoutube().getThumb();
        String vidTitle = request.getYoutube().getVidTitle();

//        List<Playlist> playlist = playListRepository.findById(request.getPlaylistId());

        Optional<Playlist> playlist = playListRepository.findById(playlistId);



// + music에 데이터들 담아서 save해주기 11월 04일 마무리
//        Music music = new Music(vidTitle, author, vidUrl, infoDuration, thumb, playlist);

//        musicRepoService.save(music);

        return MusicResponse.success();
    }
}
