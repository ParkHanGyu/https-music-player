package com.hmplayer.https_music_player.domain.common.customexception;

public class AuthNumberMismatchException extends RuntimeException{
    public AuthNumberMismatchException(String authNumber) {
        super(String.format("사용자가 입력한 '%s'는 redis에 저장된 인증번호와 일치하지 않습니다.", authNumber)); // %d <- 정수형,  %s <- 문자열
    }
}
