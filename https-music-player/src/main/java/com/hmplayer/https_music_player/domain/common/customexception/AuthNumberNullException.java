package com.hmplayer.https_music_player.domain.common.customexception;

public class AuthNumberNullException extends RuntimeException{
    public AuthNumberNullException(String email) {
        super(String.format("인증번호 유효시간이 초과되었거나 '%s'는 redis에 없는 email 입니다.", email)); // %d <- 정수형,  %s <- 문자열
    }
}
