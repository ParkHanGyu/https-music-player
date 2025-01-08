package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.object.YoutubeDto;
import com.hmplayer.https_music_player.domain.dto.request.AddPlayListToMusicRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistNameRequest;
import com.hmplayer.https_music_player.domain.dto.request.UpdatePlaylistOrderRequest;
import com.hmplayer.https_music_player.domain.dto.response.music.CopyMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.DeleteMusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.music.MusicResponse;
import com.hmplayer.https_music_player.domain.dto.response.playlist.UpdatePlaylistNameResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import com.hmplayer.https_music_player.domain.jpa.entity.PlaylistMusic;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.service.MusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlayListRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.PlaylistMusicRepoService;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.Musicservice;
import com.sun.jdi.InternalException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicServiceImpl implements Musicservice {
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
        log.info("추가할 노래 제목 = {}, infoDuration = {}, 추가할 플레이리스트 ID = {}", youtube.getVidTitle(),infoDuration,playlistId);


        Optional<PlaylistMusic> findExistingMusic = playlistMusicRepoService.findByPlaylistIdAndMusicUrl(playlistId,youtube.getVidUrl());

        log.info("findExistingMusic = {}", findExistingMusic);

        if (findExistingMusic.isPresent()) {
            // 중복된 경우: 이미 존재하는 음악 데이터
            System.out.println("중복입니다. return.");
            return MusicResponse.existingMusic();
        }


        // playlistId의 재생목록의 정보들을 가져옴
        Optional<Playlist> optionalPlaylist = playListRepoService.findById(playlistId);
        // optionalPlaylist = Optional[Playlist(playlistId=1, user=user정보, title=test1, musics=[..] ... [..]
        log.info("optionalPlaylist = {}",optionalPlaylist);
        if (optionalPlaylist.isEmpty()) {
            return ResponseEntity.badRequest().body(new MusicResponse());
        }

        Playlist playlist = optionalPlaylist.get();

        Music addMusicInfo = new Music(youtube, infoDuration);

//
        // playlist.getMusics()에서 현재 최대 order 값 가져오기
        int maxOrder = playlist.getMusics()
                .stream()
                .mapToInt(PlaylistMusic::getOrderValue)
                .max()
                .orElse(0);
        System.out.println("maxOrder 값 : " + maxOrder);

        int newOrderValue = maxOrder + 10;
//
        PlaylistMusic playlistMusic = new PlaylistMusic(playlist,addMusicInfo, newOrderValue);

        addMusicInfo.setPlaylists(Collections.singletonList(playlistMusic));

        musicRepoService.save(addMusicInfo);

        return MusicResponse.success();
    }

    @Override
    public ResponseEntity<? super DeleteMusicResponse> deleteMusic(Long musicId, String email) {
        try{
            User user = userRepoService.findByEmail(email);

            // 해당 사용자의 Playlist에 해당 Music이 존재하는지 확인
            PlaylistMusic playlistMusic = playlistMusicRepoService.findByUserAndMusicId(user.getId(), musicId)
                    .orElseThrow(() -> new IllegalArgumentException("삭제 권한이 없거나 음악이 존재하지 않습니다."));

            playlistMusicRepoService.deletePlaylistMusicByUserAndMusicId(user.getId(), musicId);

            musicRepoService.deleteByMusicId(musicId);

            return DeleteMusicResponse.success();
        } catch (Exception e) {
        e.printStackTrace();
        throw new InternalException();
        }
    }

    @Override
    public ResponseEntity<? super CopyMusicResponse> copyMusic(Long musicId, String email) {
        log.info("클라이언트에서 받아온 데이터 : musicId = {}, email = {}",musicId,email);
        System.out.println("musicId = " + musicId);
        System.out.println("email = " + email);
        return CopyMusicResponse.success();
    }


    // 음악 순서 변경
    @Override
    public ResponseEntity<?> updatePlaylistOrder(Long playlistId, UpdatePlaylistOrderRequest request, String email) {
        // 1. DB에서 해당 playlistId와 관련된 orderValue 리스트를 가져옴
        List<PlaylistMusic> playlistMusics = playlistMusicRepoService.findByPlaylistIdOrderByOrderValue(playlistId);

        log.info("playlistMusics 값 : {}", playlistMusics);
        int hoveredIndex = request.getHoveredIndex();
        int newOrderValue;

        // 이동 위치가 첫번쨰 노래일 경우
        if (hoveredIndex == 0) {
            System.out.println("리스트의 맨 앞에 삽입할 경우");
            // 첫번쨰값 / 2 해서 나오는 값 newOrderValue에 넣어주기

            // 이전 노래의 orderValue값
            int firstOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            newOrderValue =  (firstOrderValue + 0) / 2;
            // 근데 계속 2로 나누다보면 값이 0으로 고정됨. 이럴때 재정렬 필요


        // 이동 위치가 맨끝인 경우
        } else if (hoveredIndex + 1 >= playlistMusics.size()) {
            System.out.println("리스트의 맨 뒤에 삽입할 경우");
            // 이전값 + 10 해서 나오는 값 newOrderValue에 넣어주기
//            return playlistMusics.get(playlistMusics.size() - 1).getOrderValue() + 10;
            int lastOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            newOrderValue =  lastOrderValue + 10;

        } else {
            System.out.println("음악과 음악 사이로 순서를 바꿀 경우");
            // 위에서 아래로 이동할경우

//            if() {
//                // 이전 노래의 orderValue값
//                int previousOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
//
//                // 다음 노래의 orderValue값
//                int nextOrderValue = playlistMusics.get(hoveredIndex + 1).getOrderValue();
//
//            }

            // 아래에서 위로 이동할경우

            // 이전 노래의 orderValue값
            int previousOrderValue = playlistMusics.get(hoveredIndex - 1).getOrderValue();

            // 다음 노래의 orderValue값
            int nextOrderValue = playlistMusics.get(hoveredIndex).getOrderValue();
            // (뒤 + 앞) / 2
            log.info("previousOrderValue : {}, nextOrderValue: {}",previousOrderValue,nextOrderValue);

            newOrderValue = (previousOrderValue + nextOrderValue) / 2;
        }
        System.out.println("최종 newOrderValue 값 : " + newOrderValue);

        int targetIndex = IntStream.range(0, playlistMusics.size())
                .filter(i -> playlistMusics.get(i).getMusicId() == request.getMusicId()) // 조건: musicId가 request.getMusicId()인지 확인
                .findFirst()
                .orElse(-1); // 조건을 만족하는 데이터가 없을 경우 -1 반환

        if (targetIndex == -1) {
//            return ResponseEntity.badRequest().body("해당 musicId에 해당하는 음악을 찾을 수 없습니다.");
            System.out.println("해당 musicId에 해당하는 음악을 찾을 수 없습니다.");
            return null;
        }


        // 타겟 음악의 orderValue를 newOrderValue로 set해줌
        playlistMusics.get(targetIndex).setOrderValue(newOrderValue);

        if (newOrderValue % 10 == 1 || newOrderValue % 10 == 9) {
            System.out.println("재배치 후 저장");
            reorderPlaylist(playlistMusics); // 재배치 후 저장
//            return ResponseEntity.ok("재배치가 완료되었습니다.");
            return null;
        } else {
            System.out.println("재배치가 필요없는 저장");
            playlistMusicRepoService.save(playlistMusics.get(targetIndex)); // 재배치 없이 저장
        }


        return null;
    }


    private void reorderPlaylist(List<PlaylistMusic> playlistMusics) {

        // newOrderValue 적용된 리스트의 orderValue 기준으로 순서 정렬
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

        playlistMusicRepoService.saveAll(playlistMusics);
        log.info("=== 재배치 완료 ===");
    }


}
