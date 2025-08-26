package com.hmplayer.https_music_player.domain.dto.object;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BasicInfoDto {

    private String url;  // 음악 URL ++
    private String imageUrl;  // 음악 이미지 ++
    private String author;  // 음악 작곡가 ++
    private String title;  // 음악 제목 ++


}
