package com.hmplayer.https_music_player.global.exception;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.common.customexception.*;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Music ID 확인
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

    // PlaylistMuisc테이블에 이미 노래가 존재 = 중복 노래
    @ExceptionHandler(PlaylistMusicDuplication.class)
    public ResponseEntity<ResponseDto> PlaylistMusicDuplication(PlaylistMusicDuplication ex) {
        log.warn("PlaylistMusicDuplication 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.DUPLICATE_PLAYLIST_MUSIC, ResponseMessage.DUPLICATE_PLAYLIST_MUSIC));
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ResponseDto> UnauthorizedAccessException(UnauthorizedAccessException ex) {
        log.warn("UnauthorizedAccessException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.FORBIDDEN_ACCESS, ResponseMessage.FORBIDDEN_ACCESS));
    }

    // 이메일 중복
    @ExceptionHandler(EmailDuplicatedException.class)
    public ResponseEntity<ResponseDto> EmailDuplicatedException(EmailDuplicatedException ex) {
        log.warn("EmailDuplicatedException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.DUPLICATE_EMAIL, ResponseMessage.DUPLICATE_EMAIL));
    }

    // 유효하지 않은 인증번호(인증번호 유효시간 초과, redis에 해당 이메일에 대한 정보가 없을 경우)
    @ExceptionHandler(AuthNumberNullException.class)
    public ResponseEntity<ResponseDto> AuthNumberNullException(AuthNumberNullException ex) {
        log.warn("AuthNumberNullException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.NON_VALID_AUTHNUMBER, ResponseMessage.NON_VALID_AUTHNUMBER));
    }

    // 사용자가 입력한 인증번호가 redis에 저장된 인증번호와 일치하지 않을경우.
    @ExceptionHandler(AuthNumberMismatchException.class)
    public ResponseEntity<ResponseDto> AuthNumberMismatchException(AuthNumberMismatchException ex) {
        log.warn("AuthNumberMismatchException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.NON_VALID_AUTHNUMBER, ResponseMessage.NON_VALID_AUTHNUMBER));
    }

    // Redis관련 예외
    @ExceptionHandler(RedisException.class)
    public ResponseEntity<ResponseDto> RedisException(RedisException ex) {
        log.warn("RedisException 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ResponseDto(ResponseCode.SERVICE_UNAVAILABLE, ResponseMessage.SERVICE_UNAVAILABLE));
    }


    // 그 외 예상치 못한 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto> handleAll(Exception ex) {
        log.warn("handleAll 발생: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDto("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다."));
    }
}
