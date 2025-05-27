package com.hmplayer.https_music_player.global.exception;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.common.customexception.MusicIdNotFoundException;
import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.common.customexception.PlaylistMusicNotFoundException;
import com.hmplayer.https_music_player.domain.common.customexception.PlaylistNotFoundException;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MusicIdNotFoundException.class)
    public ResponseEntity<ResponseDto> handleMusicIdNotFound(MusicIdNotFoundException ex) {
        log.warn("handleMusicIdNotFound 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.NON_EXISTED_MUSIC, ResponseMessage.NON_EXISTED_MUSIC));
    }

    @ExceptionHandler(PlaylistMusicNotFoundException.class)
    public ResponseEntity<ResponseDto> PlaylistMusicNotFoundException(PlaylistMusicNotFoundException ex) {
        log.warn("PlaylistMusicNotFoundException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.PLAYLIST_MUSIC_EMPTY, ResponseMessage.PLAYLIST_MUSIC_EMPTY));
    }

    // playlist ID 확인
    @ExceptionHandler(PlaylistNotFoundException.class)
    public ResponseEntity<ResponseDto> PlaylistNotFoundException(PlaylistNotFoundException ex) {
        log.warn("PlaylistNotFoundException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.NON_EXISTED_PLAYLIST, ResponseMessage.NON_EXISTED_PLAYLIST));
    }

    // user 확인 실패
    @ExceptionHandler(NonExistUserException.class)
    public ResponseEntity<ResponseDto> NonExistUserException(NonExistUserException ex) {
        log.warn("NonExistUserException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.NON_EXISTED_USER, ResponseMessage.NON_EXISTED_USER));
    }


    // 그 외 예상치 못한 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto> handleAll(Exception ex) {
        log.warn("handleAll 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDto("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다."));
    }
}
