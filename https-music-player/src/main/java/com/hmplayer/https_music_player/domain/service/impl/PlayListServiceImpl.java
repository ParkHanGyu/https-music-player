package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoSerivce;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayListServiceImpl implements PlayListService {
    private final PlayListRepoSerivce playListRepoSerivce;

    @Override
    public ResponseEntity<? super PlayListResponse> addPlayList(AddPlayListRequest request){

        String userName = request.getUserName();
        String playListName = request.getPlayListName();
        Playlist playlist = new Playlist(userName,playListName);

        playListRepoSerivce.save(playlist);
        return null;
    }
    @Override
    public ResponseEntity<? super PlayListResponse> getPlayList(String userName) {
        List<PlayListDto> playLists; // dto 변환할것
        List<Playlist> filteredPlayList; //

        System.out.println("서버에서 받아온 playListName : " + userName);

        filteredPlayList = playListRepoSerivce.findListByName(userName);

        playLists = PlayListDto.ofList(filteredPlayList);

        return PlayListResponse.success(playLists);
    }

}
