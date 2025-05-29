package com.hmplayer.https_music_player.domain.common.customexception;

public class PlaylistMusicDuplication extends RuntimeException {

    public PlaylistMusicDuplication(String musicTitle, Long playlistId) {
        super(String.format("PlaylistMusic 테이블에는 이미 musicTitle = '%s', playlist_id = '%d' 가 이미 있습니다.", musicTitle, playlistId)); // %d <- 정수형,  %s <- 문자열
    }
}
