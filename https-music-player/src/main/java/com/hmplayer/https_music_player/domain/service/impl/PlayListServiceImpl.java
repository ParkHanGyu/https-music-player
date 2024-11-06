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
        Optional<Playlist> filteredPlayList = playListRepoService.findById(playlistId);

        if (filteredPlayList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Playlist playlist = filteredPlayList.get();


        System.out.println("findById한 값 : "+filteredPlayList.get());
        System.out.println("filteredPlayList.get().getMusics() 값 : "+filteredPlayList.get().getMusics());

        List<PlaylistMusic> test1 = filteredPlayList.get().getMusics();
        System.out.println("test1 값 : "+filteredPlayList.get().getMusics());

        List<MusicDto> musicDtos = playlist.getMusics()
                .stream()
                .map(PlaylistMusic::getMusic)
                .map(music -> new MusicDto()) // 명시적으로 생성자 호출
                .toList();

        System.out.println("musics 값 : "+musicDtos);


        //==============================




        List<Music> musicList1 = filteredPlayList.get().getMusics().stream()
                .map(PlaylistMusic::getMusic)
                .collect(Collectors.toList());

        // PlaylistMusic을 가져와서 music 객체만 추출
        List<Music> musicList2 = filteredPlayList.get().getMusics().stream()
                .map(playlistMusic -> playlistMusic.getMusic())
                .collect(Collectors.toList());

        List<Music> musicList3 = playlist.getMusics().stream()
                .map(PlaylistMusic::getMusic)  // PlaylistMusic에서 Music만 추출
                .collect(Collectors.toList());

        System.out.println("filteredPlayList.get().getMusics(); 값 : "+filteredPlayList.get().getMusics());
        System.out.println("musicList1 : "+musicList1);
        System.out.println("musicList2 : "+musicList2);
        System.out.println("musicList3 : "+musicList3);




        return GetMusicResponse.success(musicDtos);
    }

}
