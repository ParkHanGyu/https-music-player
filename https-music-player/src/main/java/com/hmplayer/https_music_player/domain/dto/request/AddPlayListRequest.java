package com.hmplayer.https_music_player.domain.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddPlayListRequest {
    private String playListName;
    private String user;
}
