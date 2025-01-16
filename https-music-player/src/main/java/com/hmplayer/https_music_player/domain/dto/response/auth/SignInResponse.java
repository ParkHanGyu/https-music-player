package com.hmplayer.https_music_player.domain.dto.response.auth;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignInResponse extends ResponseDto {

    private String accessToken; // front에 넘겨줄 token
    private String refreshToken; // 리프레시 토큰
    private int accessTokenExpirationTime; // 토큰 만료 시간
    private int refreshTokenExpirationTime; // 토큰 만료 시간



    public SignInResponse(String accessToken, String refreshToken, int accessTokenExpirationTime, int refreshTokenExpirationTime) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accessTokenExpirationTime = accessTokenExpirationTime;
        this.refreshTokenExpirationTime = refreshTokenExpirationTime;
    }


    public static ResponseEntity<SignInResponse> success(String accessToken, String refreshToken, int accessTokenExpirationTime, int refreshTokenExpirationTime){ // 로그인 성공 시
        return ResponseEntity.status(HttpStatus.OK).body(new SignInResponse(accessToken, refreshToken, accessTokenExpirationTime, refreshTokenExpirationTime));
    }

    public static ResponseEntity<ResponseDto> loginFail(){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.SIGN_IN_FAIL,ResponseMessage.SIGN_IN_FAIL));
    }
}
