package com.hmplayer.https_music_player.domain.common.customexception;

public class MusicIdNotFoundException extends RuntimeException {
    public MusicIdNotFoundException() {
        super();
    }

    public MusicIdNotFoundException(Long musicId) {
        super(String.format("ID가 '%d'인 음악을 찾을 수 없습니다.", musicId)); // %d <- 정수형,  %s <- 문자열
    }
}
