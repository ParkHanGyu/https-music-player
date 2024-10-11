package com.hmplayer.https_music_player.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@ToString
@Getter
public class ResponseDto {

    private String code;
    private String message;
}
