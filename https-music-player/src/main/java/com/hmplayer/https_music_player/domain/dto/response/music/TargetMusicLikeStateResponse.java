package com.hmplayer.https_music_player.domain.dto.response.music;

import com.hmplayer.https_music_player.domain.common.ResponseCode;
import com.hmplayer.https_music_player.domain.common.ResponseMessage;
import com.hmplayer.https_music_player.domain.dto.object.PlayListDto;
import com.hmplayer.https_music_player.domain.dto.response.ResponseDto;
import lombok.Getter;
import lombok.ToString;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
@ToString
public class TargetMusicLikeStateResponse extends ResponseDto {

    private final boolean targetLikeState;

    public TargetMusicLikeStateResponse(boolean targetLikeState) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.targetLikeState = targetLikeState;
    }



    public static ResponseEntity<TargetMusicLikeStateResponse> success(boolean targetLikeState){
        return ResponseEntity.ok(new TargetMusicLikeStateResponse(targetLikeState));
    }
}
