package com.hmplayer.https_music_player.domain.common;

public interface ResponseMessage {
    String SUCCESS = "Success.";

    String DATABASE_ERROR = "Databse error";
    String FORBIDDEN_ACCESS = "권한이 없습니다.";

    String BAD_REQUEST = "Bad Request";
    String DUPLICATE_EMAIL = "Duplicate Email";
    String DUPLICATE_MUSIC = "이미 존재하는 음악입니다.";
    String NON_EXISTED_USER = "존재하지 않는 유저입니다."; // Non existed user
    String SIGN_IN_FAIL = "Login information mismatch.";
    String REFRESH_TOKEN_EXPIRATION = "리프레쉬 토큰 만료";

    String DUPLICATE_PLAYLIST_MUSIC = "이미 존재하는 음악입니다."; // 중복노래

    String NON_EXISTED_MUSIC = "존재하지 않는 음악입니다.";

    String PLAYLIST_MUSIC_EMPTY = "특정 플레이리스트에 음악이 없습니다.";
    String NON_EXISTED_PLAYLIST = "존재하지 않는 플레이리스트 입니다.";


    String TEST_ERROR = "TEST ERROR";

    String EMAIL_SEND_FAIL = "이메일 발송 실패";
    



}
