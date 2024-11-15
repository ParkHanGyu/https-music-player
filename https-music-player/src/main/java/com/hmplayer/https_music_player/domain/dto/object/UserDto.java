package com.hmplayer.https_music_player.domain.dto.object;

import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.entity.enumType.ADMIN;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDto {
    private String email;
    private String profileImage;
    private ADMIN admin;

    public UserDto(String email, String profileImage, ADMIN admin) {
        this.email = email;
        this.profileImage = profileImage;
        this.admin = admin;
    }



    public static UserDto of(User user){
        return new UserDto(user.getEmail(), user.getImageUrl(), user.getAdmin());
    }
}
