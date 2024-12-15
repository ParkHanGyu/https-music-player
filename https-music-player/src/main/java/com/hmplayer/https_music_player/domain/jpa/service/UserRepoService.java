package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserRepoService {

    private final UserRepository userRepository;
    private final String FILE_STORAGE_DIR = "C:/Users/PHG/Desktop/image/"; // 실제 경로로 수정 필요

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


    @Transactional
    public String saveFile(Long userId, MultipartFile file) {
        System.out.println("service 실행");
        try {
            // 파일 저장 경로 생성
            System.out.println("try 실행");

            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = userId + "_" + System.currentTimeMillis() + fileExtension;
            String filePath = FILE_STORAGE_DIR + newFilename;

            System.out.println("1");

            // 파일을 실제 디렉토리에 저장
            file.transferTo(new File(filePath));
            System.out.println("2");

            // 사용자 정보 가져오기
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NonExistUserException());

            System.out.println("3");

            // 프로필 이미지 경로 업데이트
            user.setProfileImage(filePath);
            System.out.println("4");

            System.out.println("db에 save하는 데이터 : "+user);
            System.out.println("5");
            userRepository.save(user); // DB에 반영
            System.out.println("6");

            return filePath; // 저장된 파일 경로 반환
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }


}
