package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.common.customexception.*;
import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.MusicLikeRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicLikeResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.UpdateOrderValueResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.MusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlayListRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.PlaylistMusicRepository;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import com.hmplayer.https_music_player.domain.jpa.service.MusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlaylistMusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.MusicService;
import com.sun.jdi.InternalException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicServiceImpl implements MusicService {
    private final MusicRepoService musicRepoService;
    private final PlayListRepoService playListRepoService;
    private final UserRepoService userRepoService;
    private final JwtSecurity jwtSecurity;
    private final PlaylistMusicRepoService playlistMusicRepoService;

    private final MusicRepository musicRepository;
    private final UserRepository userRepository;
    private final PlayListRepository playListRepository;
    private final PlaylistMusicRepository playlistMusicRepository;


    // 음악 추가
    @Override
    public ResponseEntity<? super MusicResponse> addPlayListToMusic(AddPlayListToMusicRequest request, String token) {
        // 0. 데이터 무결성 확인
        // 0-1. 요청하는 user가 db에 존재하는 user인가
        // 토큰 추출
        System.out.println("0 데이터 무결성 확인");
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String requestUserEmail = jwtSecurity.getEmailFromToken(token);
        // db에 user 데이터를 찾고, 없으면 예외 발생
        userRepository.findByEmail(requestUserEmail).orElseThrow(() -> new NonExistUserException(requestUserEmail));

        // 0-2. 추가하려는 playlist가 db에 존재하는 playlist인가
        Long requestPlaylistId = request.getPlaylistId();
        Optional<Playlist> databasePlaylist = playListRepository.findByPlaylistId(requestPlaylistId);
        // 요청하는 playlist가 있으면 addPlaylistData에 저장 / 없으면 예외 발생
        Playlist addPlaylistData = databasePlaylist.orElseThrow(() ->
            new PlaylistNotFoundException(requestPlaylistId)
        );

        // 여기까지 왔다면 유저의 요청은 정상적임. 검증된 user, 존재하는 playlist 이므로 메소드 진행
        // 1. Music테이블 음악 확인
        // db에 해당 음악이 있는지 확인
        String requestMusicUrl = request.getMusicInfoData().getVidUrl();
        Optional<Music> optionalMusic = musicRepository.findByUrl(requestMusicUrl);
        Music finalMusicData; // 최종적으로 사용할 Music 객체
        if(optionalMusic.isEmpty()) { // optionalMusic 값이 비어있을때 - Music 테이블 추가
            // 기본 음악 data
            MusicInfoDataDto musicInfoData = request.getMusicInfoData();
            // 음악 time
            int infoDuration = request.getInfoDuration();

            Music newMusic = new Music(musicInfoData, infoDuration);
            finalMusicData = musicRepository.save(newMusic);
        } else { // optionalMusic 값이 존재할때 - 해당 optionalMusic 데이터 그대로 사용
            finalMusicData = optionalMusic.get(); // 기존 Music 객체 사용
        }


        // 2. PlaylistMusic 테이블 확인
        // PlaylistMusic 테이블에 사용자가 요청하는 데이터의 조합이 있는지 확인
        System.out.println("playlustMuisc 테이블 확인");
        Optional<PlaylistMusic> optionalPlaylistMusic =
                playlistMusicRepository.findByPlaylist_PlaylistIdAndMusic_MusicId(addPlaylistData.getPlaylistId(), finalMusicData.getMusicId());

        if(optionalPlaylistMusic.isPresent()) {// optionalPlaylistMusic 존재할때 - music도 있고 playlistMusic 테이블에도 있기 때문에 중복 추가 예외 발생
            System.out.println("playlistMusic 테이블에 데이터가 존재함. 음악 중복 추가로 예외 발생");
            throw new PlaylistMusicDuplication(request.getMusicInfoData().getVidTitle(),request.getPlaylistId());
        }


        // playlistMusic 데이터가 없기 때문에 저장할 데이터들 준비
        // orderValue값 세팅
        System.out.println("playlistMusic 테이블에 데이터가 없기 떄문에. 저장할 데이터들 준비");

        Optional<Integer> maxOrderOpt = playlistMusicRepository.findMaxOrderValueByPlaylistId(requestPlaylistId);
        int currentMaxOrder = maxOrderOpt.orElse(10);
        int newCalculatedOrderValue = currentMaxOrder + 10;
        log.info("PlaylistMusic 테이블 데이터 추가시 들어가는 OrderValue값 = {} ", newCalculatedOrderValue);


        // PlaylistMusic 테이블에 넣어줄 객체들 set
        PlaylistMusic newPlaylistMusicEntry = new PlaylistMusic(addPlaylistData, finalMusicData, newCalculatedOrderValue);
        // 슛
        PlaylistMusic savedEntry = playlistMusicRepository.save(newPlaylistMusicEntry);
            log.info("PlaylistMusic 테이블에 데이터 추가 완료. ID: {}, Playlist ID: {}, Music ID: {}, Order: {}",
                    savedEntry.getId(), // 자동 생성된 PlaylistMusic 레코드의 ID
                    addPlaylistData.getPlaylistId(),
                    finalMusicData.getMusicId(),
                    newCalculatedOrderValue);
        return MusicResponse.success();
    }

    // 음악 삭제
    @Transactional
    @Override
    public ResponseEntity<? super DeleteMusicResponse> deleteMusic(Long playlistId, Long musicId, String email) {
        log.info("playlistId ={} , musicId = {}, email = {}", playlistId, musicId, email);
            // 삭제하려는 대상 데이터 접근. (우리는 PLaylistMusic 테이블에 특정 데이터를 지울 예정) ->
            Optional<PlaylistMusic> optionalPlaylistMusic = playlistMusicRepository.findByPlaylist_PlaylistIdAndMusic_MusicId(playlistId, musicId);
            // 가져온 데이터의 Playlist테이블에 데이터가 우리가 접근할때 들어온 사용자의 ID와 일치한지 확인(권한이 있는가?) ->

            PlaylistMusic playlistMusic = optionalPlaylistMusic.orElseThrow(() ->
                    new PlaylistMusicNotFoundException(playlistId, musicId)
            );

            Long playlistMusicUserId = playlistMusic.getPlaylist().getUser().getId();
            User user = userRepoService.findByEmail(email);
            Long userId = user.getId();
            if(playlistMusicUserId == userId) {
                System.out.println("db에서 가져온 userId와 실제 접근한 userId가 같음. 삭제 권한이 있음. 삭제 로직 진행");
                // 일치하면 해당 데이터 삭제
                playlistMusicRepoService.deleteByPlaylist_PlaylistIdAndMusic_MusicId(playlistId, musicId);
            } else {
                System.out.println("db에서 가져온 userId와 실제 접근한 userId가 다름. 삭제 권한이 없음. 로직 중지");
                throw new UnauthorizedAccessException(playlistId, playlistMusicUserId);
            }

            musicRepoService.deleteMusicIfOrphaned(musicId);

            return DeleteMusicResponse.success();
    }

    // 음악 순서 변경
    @Override
    public ResponseEntity<? super UpdateOrderValueResponse> updatePlaylistOrder(Long playlistId, UpdatePlaylistOrderRequest request, String email) {
        // 1. DB에서 해당 playlistId와 관련된 orderValue 리스트를 가져옴
        List<PlaylistMusic> playlistMusics = playlistMusicRepoService.findByPlaylistIdOrderByOrderValue(playlistId);
        if (playlistMusics.isEmpty()) {
            throw new PlaylistMusicNotFoundException();
        }
        // 이동하고 싶은 위치 index 값
        int hoveredIndex = request.getHoveredIndex();
        // 바꿔줄 orderValue 값
        int newOrderValue;
        // hoveredIndex 기준 뒤에 있는 노래의 orderValue 값
        int previousOrderValue;
        // hoveredIndex 기준 앞에 있는 노래의 orderValue 값
        int nextOrderValue;

        // 바꾸려는 노래가 playlistMusics 리스트에 몇번째 index 인지 할당
        int dragItemIndex = IntStream.range(0, playlistMusics.size())
                .filter(i -> playlistMusics.get(i).getMusicId().equals(request.getMusicId())) // playlistMusics 테이블에 request.getMusicId()인 musicId가 있는지 확인
                .findFirst()
                .orElse(-1); // 조건을 만족하는 데이터가 없을 경우 -1 반환
        if (dragItemIndex == -1) {
            throw new MusicIdNotFoundException();
        }

        // 2.
        if (hoveredIndex == 0) { // 이동 위치가 재생목록의 첫번쨰인 경우
            System.out.println("리스트의 맨 앞에 삽입할 경우");
            // 첫번쨰값 / 2 해서 나오는 값 newOrderValue에 넣어주기

            // playlistMusics에서 첫번째 노래의 orderValue값
            int firstOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            newOrderValue = firstOrderValue / 2;
        } else if (hoveredIndex + 1 >= playlistMusics.size()) { // 이동 위치가 재생목록의 맨끝인 경우
            System.out.println("리스트의 맨 뒤에 삽입할 경우");
            // playlistMusics에서 마지막 노래의 orderValue값
            int lastOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            newOrderValue = lastOrderValue + 10;

        } else {  // 그 외(이동 위치가 음악과 음악 사이일 경우)
            System.out.println("음악과 음악 사이로 순서를 바꿀 경우");

            // targetIndex 해당 음악 ID와 일치한 index값을 가져옴
            // 드래그 중인 음악의 orderValue 값
            int dragItemOrderValue = playlistMusics.get(dragItemIndex).getOrderValue();
            // 드래그 중인 노래가 들어갈 자리에 원래 있던 orderValue 값
            int existingItemOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            log.info("dragItemOrderValue = {}, testValue2 = {}",dragItemOrderValue, existingItemOrderValue);

            if(dragItemOrderValue < existingItemOrderValue) { // 드래그중인 아이템의 orderVlaue가 자리에 원래 있던 아이템의 orderValue가 더 크다면
                System.out.println("위에서 아래로 이동할 경우");
                previousOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
                nextOrderValue = playlistMusics.get(hoveredIndex + 1).getOrderValue();

            } else { // 그외 (아래에서 위로 이동할 경우)
                System.out.println("아래에서 위로 이동할 경우");
                previousOrderValue = playlistMusics.get(hoveredIndex - 1).getOrderValue();
                nextOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            }

            newOrderValue = (previousOrderValue + nextOrderValue) / 2;
        }
        System.out.println("최종 newOrderValue 값 : " + newOrderValue);

        // 드래그한 음악의 orderValue를 newOrderValue로 set해줌
        playlistMusics.get(dragItemIndex).setOrderValue(newOrderValue);

        playlistMusicRepoService.reorderAndSavePlaylist(playlistMusics);

        return UpdateOrderValueResponse.success();
    }


    @Override
    public ResponseEntity<? super MusicLikeResponse> musicLike(MusicLikeRequest request, String email) {
    log.info("request = {}, email = {}", request, email);


//        return MusicLikeResponse.success();
        return null;
    }


}
