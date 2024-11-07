package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.GetMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoService;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayListServiceImpl implements PlayListService {
    private final PlayListRepoService playListRepoService;


    @Override
    public ResponseEntity<? super PlayListResponse> addPlayList(AddPlayListRequest request){

        String userName = request.getUserName();
        String playListName = request.getPlayListName();
        Playlist playlist = new Playlist(userName,playListName);

        playListRepoService.save(playlist);

        return PlayListResponse.success();
    }


    @Override
    public ResponseEntity<? super PlayListResponse> getPlayListLibrary(String userName) {
        List<PlayListDto> playLists; // dto 변환할것
        List<Playlist> filteredPlayList; //

        System.out.println("서버에서 받아온 playListName : " + userName);

        filteredPlayList = playListRepoService.findListByName(userName);

        playLists = PlayListDto.ofList(filteredPlayList);

        return PlayListResponse.success(playLists);
    }

    @Override
    public ResponseEntity<? super GetMusicResponse> getPlayList(Long playlistId) {
        List<MusicDto> musicsData;
        try{
            Optional<Playlist> filteredPlayList = playListRepoService.findById(playlistId);

            if (filteredPlayList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Playlist playlistAndMusics = filteredPlayList.get();

            musicsData = playlistAndMusics.getMusics()
                    .stream()
                    .map(PlaylistMusic::getMusic)
                    .map(MusicDto::new) // 명시적으로 생성자 호출
                    .toList();


        } catch(Exception e) {
            e.printStackTrace();
            return GetMusicResponse.databaseError();

        };
        return GetMusicResponse.success(musicsData);


    }

}
