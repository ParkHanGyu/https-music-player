package com.hmplayer.https_music_player.domain.common.customexception;

import com.hmplayer.https_music_player.domain.jpa.entity.Music;
import com.hmplayer.https_music_player.domain.jpa.entity.User;

public class NonExistLikeException extends RuntimeException{

    public NonExistLikeException(Long searchUserId, Long searchMusicId) {
        super(String.format("Like 테이블에 userId = '%d', musicId = '%d'를 가진 데이터를 찾을 수 없습니다.", searchUserId, searchMusicId)); // %d <- 정수형,  %s <- 문자열
    }
}
