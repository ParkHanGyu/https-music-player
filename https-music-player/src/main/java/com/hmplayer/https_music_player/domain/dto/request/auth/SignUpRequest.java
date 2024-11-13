package com.hmplayer.https_music_player.domain.dto.request.auth;

import com.hmplayer.https_music_player.domain.jpa.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {
    private String profileImage;
    private String email;
    private String password;

    public static User of(SignUpRequest request, String password) {
        User user = new User();
        user.setUser(request.email, password);
        return user;
    }
}
