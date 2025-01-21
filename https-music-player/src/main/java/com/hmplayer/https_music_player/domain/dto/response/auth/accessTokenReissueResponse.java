package com.hmplayer.https_music_player.domain.dto.response.auth;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class accessTokenReissueResponse extends ResponseDto {

//    @JsonProperty("accessToken")
    // 응답 객체 클래스에 @Getter를 쓰거나 필드값에 @JsonProperty를 써야 한다. 왜냐면 Jackson을 사용해 데이터를 직렬화 해주는데 Jackson는 기본적으로 필드 값 대신
    // getter를 사용해 데이터를 직렬화 해준다.
    private String accessToken; // front에 넘겨줄 token
    private int accessTokenExpirationTime; // 토큰 만료 시간


    public accessTokenReissueResponse(String accessToken, int accessTokenExpirationTime) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.accessToken = accessToken;
        this.accessTokenExpirationTime = accessTokenExpirationTime;
    }


    public static ResponseEntity<accessTokenReissueResponse> success(String accessToken, int accessTokenExpirationTime){
        return ResponseEntity.status(HttpStatus.OK).body(new accessTokenReissueResponse(accessToken, accessTokenExpirationTime));
    }

    public static ResponseEntity<ResponseDto> reissueFail(){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.REFRESH_TOKEN_EXPIRATION,ResponseMessage.REFRESH_TOKEN_EXPIRATION));
    }
}
