package com.hmplayer.https_music_player.domain.common.customexception;

public class UnauthorizedAccessException extends RuntimeException{
    public UnauthorizedAccessException(Long playlistId, Long playlistMusicUserId) {
        super(String.format("사용자 ID가 다릅니다. 요청 user ID = '%s', 삭제 대상 음악의 소유자 ID = '%d' ", playlistId, playlistMusicUserId)); // %d <- 정수형,  %s <- 문자열
    }
}
