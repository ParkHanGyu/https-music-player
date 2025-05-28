package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.common.customexception.MusicIdNotFoundException;
import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.common.customexception.PlaylistMusicNotFoundException;
import com.hmplayer.https_music_player.domain.common.customexception.PlaylistNotFoundException;
import com.hmplayer.https_music_player.domain.dto.object.MusicInfoDataDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.SignUpResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
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
import org.springframework.stereotype.Service;

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
        MusicInfoDataDto musicInfoData = request.getMusicInfoData();
        int infoDuration = request.getInfoDuration();
        Long playlistId = request.getPlaylistId();
        log.info("추가할 노래 제목 = {}, infoDuration = {}, 추가할 플레이리스트 ID = {}", musicInfoData.getVidTitle(),infoDuration,playlistId);

        String musicUrl = request.getMusicInfoData().getVidUrl();
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        String email = jwtSecurity.getEmailFromToken(token);

        // 0-1. user가 존재하는지 확인(데이터 무결성을 위해) -> 없다면 error 반환
//        User userInfoData =
        userRepository.findByEmail(email).orElseThrow(() -> new NonExistUserException(email));




        //0-2. 추가하려는 playlist가 db에 실제로 존재하는지 확인(데이터 무결성을 위해)
        // 존재를 확인하고 그 값을 targetPlaylistData에 담음
        Optional<Playlist> targetPlaylistData = playListRepository.findByPlaylistId(playlistId);
        // targetPlaylistData에 값이 있다면 actualPlaylist에 담아주고
        Playlist actualPlaylist = targetPlaylistData.orElseThrow(() ->
                new PlaylistNotFoundException(playlistId) // 없다면 PlaylistNotFoundException 예외 발생
        );




        // 1. music 테이블에 해당 음악이 있는지 확인
        Optional<Music> addMusicData = musicRepository.findByUrl(musicUrl);

        // -> 있으면 playlistMusic 테이블 관계 확인
        if(addMusicData.isPresent()) { // 노래가 있다
            // 노래가 있다면 PlaylistMusic 테이블에 관계를 설정해줘야함.
            // Music 테이블에 데이터를 가져오고
            Music actualMusic = addMusicData.get();
            System.out.println("중복 노래 존재 - 하지만 등록하려는 노래가 등록하려는 재생목록에 추가하는건지 확인");
            // 그러면 혹시 그 노래는 내가 추가하려는 Playlist와 이어져 있어?
            boolean playlistMuiscExists = playlistMusicRepository
                    .existsByMusic_MusicIdAndPlaylist_PlaylistId(addMusicData.get().getMusicId(), playlistId);



            // 5월 28일
            // playlistMusic에 값이 있다면 중복이기 떄문에 중복관련한 커스텀 예외 작성해서 아래에 적용해주기

            // 내가 추가하려는 playlist와 이어져있어. => 중복 추가로 추가 할 필요 x. 종료
            if(playlistMuiscExists) {
                return MusicResponse.testResponse();
            }


            // 3-2. 너가 보내는 재생목록에 없어. - 추가해줘야함. 하지만 music 테이블에 음악 데이터는 있으니 playlistMusic 테이블에만 관계 설정
            if(!playlistMuiscExists) {

                Optional<Integer> maxOrderOpt = playlistMusicRepository.findMaxOrderValueGlobally();
                int currentMaxOrder = maxOrderOpt.orElse(0);
                int newCalculatedOrderValue = currentMaxOrder + 10;


                PlaylistMusic newPlaylistMusicEntry = new PlaylistMusic(actualPlaylist, actualMusic, newCalculatedOrderValue);
                PlaylistMusic savedEntry = playlistMusicRepository.save(newPlaylistMusicEntry);

                log.info("PlaylistMusic 테이블에 데이터 추가 완료. ID: {}, Playlist ID: {}, Music ID: {}, Order: {}",
                        savedEntry.getId(), // 자동 생성된 PlaylistMusic 레코드의 ID
                        actualPlaylist.getPlaylistId(),
                        actualMusic.getMusicId(),
                        newCalculatedOrderValue);
                return MusicResponse.testResponse();

            }


        }

        // -> 없으면 노래 추가


        Optional<PlaylistMusic> findExistingMusic = playlistMusicRepoService.findByPlaylistIdAndMusicUrl(playlistId,musicInfoData.getVidUrl());

        if (findExistingMusic.isPresent()) {
            // 중복된 경우: 이미 존재하는 음악 데이터
            System.out.println("중복입니다. return.");
            return MusicResponse.existingMusic();
        }


        // playlistId의 재생목록의 정보들을 가져옴
        Optional<Playlist> optionalPlaylist = playListRepoService.findById(playlistId);
        log.info("optionalPlaylist = {}",optionalPlaylist);
        if (optionalPlaylist.isEmpty()) {
            return ResponseEntity.badRequest().body(new MusicResponse());
        }

        Playlist playlist = optionalPlaylist.get();

        Music addMusicInfo = new Music(musicInfoData, infoDuration);

        // playlist.getMusics()에서 현재 최대 order 값 가져오기
        int maxOrder = playlist.getMusics()
                .stream()
                .mapToInt(PlaylistMusic::getOrderValue)
                .max()
                .orElse(0);
        int newOrderValue = maxOrder + 10;
        PlaylistMusic playlistMusic = new PlaylistMusic(playlist,addMusicInfo, newOrderValue);
        addMusicInfo.setPlaylists(Collections.singletonList(playlistMusic));
        musicRepoService.save(addMusicInfo);

        return MusicResponse.success();
    }

    // 음악 삭제
    @Override
    public ResponseEntity<? super DeleteMusicResponse> deleteMusic(Long playlistId, Long musicId, String email) {
        log.info("playlistId ={} , musicId = {}, email = {}", playlistId, musicId, email);
        try{
            // 삭제하려는 대상 데이터 접근. (우리는 PLaylistMusic 테이블에 특정 데이터를 지울 예정) ->
            PlaylistMusic playlistMusic = playlistMusicRepository.findByPlaylist_PlaylistIdAndMusic_MusicId(playlistId, musicId);
            // 가져온 데이터의 Playlist테이블에 데이터가 우리가 접근할때 들어온 사용자의 ID와 일치한지 확인(권한이 있는가?) ->
            Long playlistMusicUserId = playlistMusic.getPlaylist().getUser().getId();
            User user = userRepoService.findByEmail(email);
            Long userId = user.getId();
            if(playlistMusicUserId == userId) {
                System.out.println("db에서 가져온 userId와 실제 접근한 userId가 같음. 삭제 권한이 있음. 삭제 로직 진행");
                // 일치하면 해당 데이터 삭제
                playlistMusicRepoService.deleteByPlaylist_PlaylistIdAndMusic_MusicId(playlistId, musicId);
            } else {
                System.out.println("db에서 가져온 userId와 실제 접근한 userId가 다름. 삭제 권한이 없음. 로직 중지");
                return null;
            }

            // 삭제 이후 PlaylistMusic 테이블에 삭제한 노래가 있는지 확인
            Boolean remainingPlaylistMusicExists = playlistMusicRepository.existsByMusic_MusicId(musicId);
            if(!remainingPlaylistMusicExists) { // true = 노래가 없다면
                // Music 테이블에 해당 음악 삭제
                musicRepoService.deleteByMusicId(musicId);
            }

            return DeleteMusicResponse.success();
        } catch (Exception e) {
        e.printStackTrace();
        throw new InternalException();
        }
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

        reorderPlaylist(playlistMusics); // 재배치 후 저장

        playlistMusicRepoService.updatePlaylist(playlistMusics);

        log.info("=== 재배치 완료 ===");

        return UpdateOrderValueResponse.success();
    }


    private void reorderPlaylist(List<PlaylistMusic> playlistMusics) {
        // newOrderValue 적용된 리스트의 orderValue 기준으로 순서 정렬
        // reorderPlaylist가 왜 필요한가?
        // 위에서 newOrderValue로 새로운 값을 set해줬지만 정렬을 해주지 않았다. 즉
        // orderValue = 10, orderValue = 20, orderValue = 30, orderValue = 40, orderValue = 50, orderValue = 5
        // 정렬을 하지 않을 경우 이런 순서인데. 이상태로 재배치를 시작하면
        // orderValue = 10, orderValue = 20, orderValue = 30, orderValue = 40, orderValue = 50, orderValue = 60
        // orderValue가 5인 친구가 원래 10으로 재배치 되어야 하는데 for으로 재배치 할때 리스트 순서대로 들어가기 때문에 재배치를 해줘야 한다.
        playlistMusics.sort(Comparator.comparingInt(PlaylistMusic::getOrderValue));

        int orderValue = 10; // 초기값
        log.info("=== 재배치 시작 ===");

        for (PlaylistMusic pm : playlistMusics) {
            pm.setOrderValue(orderValue);
            log.info("Music ID: {}, Title: {}, New OrderValue: {}",
                    pm.getMusicId(),
                    pm.getMusic().getTitle(),
                    orderValue);
            orderValue += 10; // 10단위로 증가
        }

//        playlistMusicRepoService.saveAll(playlistMusics);
//        log.info("=== 재배치 완료 ===");
    }


}
