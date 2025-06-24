package com.hmplayer.https_music_player.domain.dto.request.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthNumberCheckRequest {
    private String email;
    private String authNumber;
}
