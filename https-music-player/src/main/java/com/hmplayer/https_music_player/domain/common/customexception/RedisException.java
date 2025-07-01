package com.hmplayer.https_music_player.domain.common.customexception;

public class RedisException extends RuntimeException{
    public RedisException() {
        super(String.format("Redis 서버가 실행되지 않았거나 포트 접속이 불가능 합니다."));
    }
}
