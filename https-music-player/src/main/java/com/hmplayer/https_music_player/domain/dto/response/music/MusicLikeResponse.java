package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@ToString
public class MusicLikeResponse extends ResponseDto  {

    public MusicLikeResponse() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<MusicLikeResponse> success(){ // 성공
        return ResponseEntity.status(HttpStatus.OK).body(new MusicLikeResponse());
    }

    public static ResponseEntity<ResponseDto> existingMusic() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto(ResponseCode.DUPLICATE_MUSIC,ResponseMessage.DUPLICATE_MUSIC));
    }

}
