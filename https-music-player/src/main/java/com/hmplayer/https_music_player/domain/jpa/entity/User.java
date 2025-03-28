package com.hmplayer.https_music_player.domain.jpa.entity;

import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.jpa.entity.enumType.ADMIN;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "user_entity")
@Getter
@NoArgsConstructor
public class User {
    // 회원 ID
    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private Long id;

    // 회원 이메일
    @Column(name = "User_Email", nullable = false)
    private String email;

    // 회원 비밀번호
    @Column(name = "User_Password", nullable = false)
    private String password;

    // 회원 프로필 이미지
    @Column(name = "User_ImageUrl")
    private String imageUrl;

    // 회원 권한
    @Enumerated(EnumType.STRING)
    private ADMIN admin = ADMIN.NORMAL;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Playlist> playlists; // 해당 유저의 재생목록들

    public void setUser(String email, String password){
        this.email = email;
        this.password = password;
    }

    public void setProfileImage(String imageUrl){
        this.imageUrl = imageUrl;

    }
}
