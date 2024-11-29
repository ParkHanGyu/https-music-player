package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.GetMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
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
    private final UserRepoService userRepoService;




    @Override
    public ResponseEntity<? super PlayListResponse> createPlayList(AddPlayListRequest request, String email){

        User user = userRepoService.findByEmail(email);

        System.out.println("findByEmail해서 찾은 User값 : " + user);

        String playListName = request.getPlayListName();
        System.out.println("클라이언트에서 받은 request.getPlayListName() 값 : " + playListName);

        Playlist playlist = new Playlist(user,playListName);
        System.out.println("값들을 셋팅한 playList 값 : " + playlist);


        playListRepoService.save(playlist);

        return PlayListResponse.success();
//        return null;
    }


    @Override
    public ResponseEntity<? super PlayListResponse> getPlayListLibrary(String email) {
        System.out.println("Impl에서 받은 값 : "+email);

        User user = userRepoService.findByEmail(email);

        System.out.println("user 값 : "+user);

        List<Playlist> filteredPlayList = playListRepoService.findByUserId(user.getId());

        System.out.println("db에서 가져온 playlists 값 : "+filteredPlayList);





        List<PlayListDto> playListLibrary; // dto 변환할것
        playListLibrary = PlayListDto.ofList(filteredPlayList);

        System.out.println("playListLibrary 값 : "+playListLibrary);


//        List<Playlist> filteredPlayList; //
//        filteredPlayList = playListRepoService.findListByName(userName);
//
//        playLists = PlayListDto.ofList(filteredPlayList);
//
        return PlayListResponse.success(playListLibrary);
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
