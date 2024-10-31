package com.hmplayer.https_music_player.domain.dto.object;

import com.hmplayer.https_music_player.domain.jpa.entity.Playlist;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PlayListDto {

    private Long playlistId;
    private String userName;
    private String title;
    private LocalDateTime createDate;


    public PlayListDto of(Playlist playList){
        this.playlistId = playList.getPlaylistId();
        this.userName = playList.getUserName();
        this.title = playList.getTitle();
        this.createDate = playList.getCreateDate();
        return this;
    }

    public static List<PlayListDto> ofList(List<Playlist> playLists){
        List<PlayListDto> result = new ArrayList<>();
        for (Playlist playList : playLists) {
            result.add(new PlayListDto().of(playList));
        }
        return result;
    }

}
