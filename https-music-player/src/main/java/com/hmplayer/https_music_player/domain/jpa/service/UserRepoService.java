package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserRepoService {

    private final UserRepository userRepository;

    @Transactional
    public Long save(User user) {
        userRepository.save(user);
        return user.getId();
    }

    public Optional<User> existCheckEmail(String email){
        return userRepository.findByEmail(email);
    }



}
