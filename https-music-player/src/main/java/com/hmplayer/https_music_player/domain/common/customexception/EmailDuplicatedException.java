package com.hmplayer.https_music_player.domain.common.customexception;

public class EmailDuplicatedException extends RuntimeException {

    public EmailDuplicatedException(String email) {
        super(String.format("'%s'는 중복된 이메일 입니다.", email)); // %d <- 정수형,  %s <- 문자열
    }
}
