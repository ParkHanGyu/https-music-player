package com.hmplayer.https_music_player.domain.common;

import com.hmplayer.https_music_player.domain.common.customexception.MusicIdNotFoundException;

public interface ResponseCode {

    String SUCCESS = "SU";

    String FORBIDDEN_ACCESS = "FA";

    String DATABASE_ERROR = "DBE";
    String BAD_REQUEST = "BR";
    String DUPLICATE_EMAIL = "DE"; // EMAIL중복
    String DUPLICATE_MUSIC = "DM"; // Music중복
    String NON_EXISTED_USER = "NU"; // 존재하지 않는 유저
    String SIGN_IN_FAIL = "SF"; // 로그인 실패
    String REFRESH_TOKEN_EXPIRATION = "RE"; // 리프레쉬토큰 만료



    String NON_EXISTED_MUSIC = "NM"; // 존재하지 않는 music
    String DUPLICATE_PLAYLIST_MUSIC = "DPM"; // 중복노래

    String PLAYLIST_MUSIC_EMPTY = "PME"; // 특정 플레이리스트에 음악이 없음
    String NON_EXISTED_PLAYLIST = "NEP"; // 존재하지 않는 플레이리스트
    String FORBIDDEN = "NEP"; // 존재하지 않는 플레이리스트

    String EMAIL_SEND_FAIL = "ESF";

    String NON_VALID_AUTHNUMBER = "NVA"; // 유효하지 않는 인증번호

    String SERVICE_UNAVAILABLE = "SEU"; // 서버 문제로 일시 중단






    String TEST_ERROR = "TR";




}
