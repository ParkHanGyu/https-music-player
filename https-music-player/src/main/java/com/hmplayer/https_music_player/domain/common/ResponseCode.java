package com.hmplayer.https_music_player.domain.common;

public interface ResponseCode {

    String SUCCESS = "SU";
    String DATABASE_ERROR = "DBE";
    String BAD_REQUEST = "BR";
    String DUPLICATE_EMAIL = "DM"; // EMAIL중복
    String NON_EXISTED_USER = "NU"; // 존재하지 않는 유저


}
