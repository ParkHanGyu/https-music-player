package com.hmplayer.https_music_player.domain.common.customexception;

public class PlaylistNotFoundException extends RuntimeException {
    public PlaylistNotFoundException() {
        super("데이터베이스에서 해당 playlist를 찾을 수 없습니다."); // 이 메시지가 ex.getMessage()의 기본값이 될 수 있음
    }

    public PlaylistNotFoundException(String message) {
        super(message); // 부모 클래스(RuntimeException)의 생성자로 메시지 전달
    }

    public PlaylistNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public PlaylistNotFoundException(Long playlistId) {
        super(String.format("ID가 '%d'인 playlist를 찾을 수 없습니다.", playlistId));
    }
}

