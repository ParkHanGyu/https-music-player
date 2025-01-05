package com.hmplayer.https_music_player.domain.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UpdatePlaylistOrderRequest {
    private int hoveredIndex;
    private Long musicId;
}
