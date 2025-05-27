package com.hmplayer.https_music_player.domain.common.customexception;

public class NonExistUserException extends RuntimeException {
    public NonExistUserException() {
        super("해당 이메일의 사용자를 찾을 수 없습니다.");
    }

    public NonExistUserException(String email) {
        super(String.format("'%s'인 이메일의 사용자를 찾을 수 없습니다.", email)); // %d <- 정수형,  %s <- 문자열
    }
}
