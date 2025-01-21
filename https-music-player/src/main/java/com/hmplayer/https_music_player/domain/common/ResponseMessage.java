package com.hmplayer.https_music_player.domain.common;

public interface ResponseMessage {
    String SUCCESS = "Success.";

    String DATABASE_ERROR = "Databse error";
    String BAD_REQUEST = "Bad Request";
    String DUPLICATE_EMAIL = "Duplicate Email";
    String DUPLICATE_MUSIC = "이미 존재하는 음악입니다.";
    String NON_EXISTED_USER = "존재하지 않는 유저입니다."; // Non existed user
    String SIGN_IN_FAIL = "Login information mismatch.";
    String REFRESH_TOKEN_EXPIRATION = "리프레쉬 토큰 만료";




}
