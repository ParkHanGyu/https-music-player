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
    private String title;
    private LocalDateTime createDate;
    private String userEmail;


    public PlayListDto of(Playlist playList){
        this.playlistId = playList.getPlaylistId();
        this.title = playList.getTitle();
        this.createDate = playList.getCreateDate();
        this.userEmail = playList.getUser().getEmail();
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
