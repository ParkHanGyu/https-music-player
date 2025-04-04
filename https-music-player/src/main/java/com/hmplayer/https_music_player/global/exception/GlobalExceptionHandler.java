package com.hmplayer.https_music_player.global.exception;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.common.customexception.MusicIdNotFoundException;
import com.hmplayer.https_music_player.domain.common.customexception.PlaylistMusicNotFoundException;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MusicIdNotFoundException.class)
    public ResponseEntity<ResponseDto> handleMusicIdNotFound(MusicIdNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.NON_EXISTED_MUSIC, ResponseMessage.NON_EXISTED_MUSIC));
    }

    @ExceptionHandler(PlaylistMusicNotFoundException.class)
    public ResponseEntity<ResponseDto> PlaylistMusicNotFoundException(MusicIdNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseDto(ResponseCode.PLAYLIST_MUSIC_EMPTY, ResponseMessage.PLAYLIST_MUSIC_EMPTY));
    }

    // 그 외 예상치 못한 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto> handleAll(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseDto("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다."));
    }
}
