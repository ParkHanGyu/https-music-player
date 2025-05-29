package com.hmplayer.https_music_player.domain.common.customexception;

public class PlaylistMusicNotFoundException extends RuntimeException {
    public PlaylistMusicNotFoundException() {
        super();
    }

    public PlaylistMusicNotFoundException(Long playlistId, Long musicId) {
        super(String.format("PlaylistMusic 테이블에 playlist_id = '%d', music_id = '%d'을 가진 값이 없습니다.", playlistId, musicId)); // %d <- 정수형,  %s <- 문자열
    }


}

