package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import com.hmplayer.https_music_player.domain.service.impl.FileServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

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

    public User findByEmail(String email){
        return optionalCheck(userRepository.findByEmail(email));
    }

    public User optionalCheck(Optional<User> optionalUser) {
        if (optionalUser.isEmpty()) {
            throw new NonExistUserException();
        }
        return optionalUser.get();
    }

}
