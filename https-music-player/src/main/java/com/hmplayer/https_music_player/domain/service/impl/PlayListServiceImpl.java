package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.MusicDto;
import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistNameRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.DeletePlaylistResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.GetMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.PlayListResponse;
import com.hmplayer.https_music_player.domain.dto.response.playlist.UpdatePlaylistNameResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.service.MusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlaylistMusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.service.PlayListService;
import com.sun.jdi.InternalException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayListServiceImpl implements PlayListService {
    private final PlayListRepoService playListRepoService;
    private final UserRepoService userRepoService;
    private final PlaylistMusicRepoService playlistMusicRepoService;
    private final MusicRepoService musicRepoService;




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
        User user = userRepoService.findByEmail(email);

        List<Playlist> filteredPlayList = playListRepoService.findByUserId(user.getId());

        List<PlayListDto> playListLibrary; // dto 변환할것
        playListLibrary = PlayListDto.ofList(filteredPlayList);
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
                    // OrderValue 기준으로 정렬해서 list 만들어줌
                    .sorted(Comparator.comparing(PlaylistMusic::getOrderValue))
                    .map(PlaylistMusic::getMusic)
                    .map(MusicDto::new) // 명시적으로 생성자 호출
                    .toList();

        } catch(Exception e) {
            e.printStackTrace();
            return GetMusicResponse.databaseError();

        };
        return GetMusicResponse.success(musicsData);
    }


    @Override
    public ResponseEntity<? super DeletePlaylistResponse> deletePlaylist(Long playlistId, String email) {
        try{
            User user = userRepoService.findByEmail(email);

            // 데이터가 있는지 확인
            Playlist optionalCheck =  playListRepoService.findPlaylistByUserAndPlaylistId(user.getId(), playlistId)
                    .orElseThrow(() -> new IllegalArgumentException("삭제 권한이 없거나 재생목록이 존재하지 않습니다."));
            System.out.println("optionalChack 값1 : " + optionalCheck);


            // 삭제하려는 재생목록에 음악이 있으면 음악들 삭제
            if(!optionalCheck.getMusics().isEmpty()) {
                // 삭제할 musicId 리스트를 먼저 수집
                List<Long> musicIds = optionalCheck.getMusics().stream()
                        .map(PlaylistMusic::getMusic)  // PlaylistMusic 객체에서 Music 객체를 가져옴
                        .map(Music::getId)             // Music 객체의 getId() 호출
                        .collect(Collectors.toList());


                System.out.println("musicIds 값 : "+musicIds);


                // playlistMusic 삭제
                playlistMusicRepoService.deleteByPlaylistId(playlistId);

                // music 삭제
                musicRepoService.deleteMusicsByIds(musicIds);
            }

            // 재생목록 삭제
            playListRepoService.deleteByPlaylistId(playlistId);


            return DeletePlaylistResponse.success();
        } catch (Exception e) {
            e.printStackTrace();
            throw new InternalException();
        }
    }



    @Override
    public ResponseEntity<? super UpdatePlaylistNameResponse> updatePlaylistName(Long modifyPlaylistId, UpdatePlaylistNameRequest request, String email) {
        // 1. modifyPlaylistId로 Playlist 조회
        Optional<Playlist> optionalPlaylist = playListRepoService.findById(modifyPlaylistId);

        if (optionalPlaylist.isEmpty()) {
            // 플레이리스트가 존재하지 않으면 404 Not Found 응답
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Playlist not found");
        }

        // 2. Playlist가 존재하면 Playlist의 이름을 수정
        Playlist playlist = optionalPlaylist.get();
        playlist.setPlaylistName(request.getModifyName()); // modifyName으로 업데이트

        // 3. 수정된 Playlist 저장
        playListRepoService.save(playlist);

        // 4. 성공적으로 업데이트한 후 200 OK 응답
        return UpdatePlaylistNameResponse.success();
    }

}
