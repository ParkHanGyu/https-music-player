package com.hmplayer.https_music_player.domain.jpa.service;

import com.hmplayer.https_music_player.domain.common.customexception.NonExistUserException;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import com.hmplayer.https_music_player.domain.service.impl.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final String FILE_STORAGE_DIR = "C:/Users/PHG/Desktop/image/"; // 실제 경로로 수정 필요
    private final FileService fileService;



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



//    @Transactional
//    public String saveFile(Long userId, MultipartFile file) {
//        System.out.println("service 실행");
//        try {
//            // 파일 저장 경로 생성
//            System.out.println("try 실행");
//
//            String originalFilename = file.getOriginalFilename();
//            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
//            String newFilename = userId + "_" + System.currentTimeMillis() + fileExtension;
//            String filePath = fileStorageDir + newFilename;
//
//            System.out.println("1");
//
//            // 파일을 실제 디렉토리에 저장
//            file.transferTo(new File(filePath));
//            System.out.println("2");
//
//            // 사용자 정보 가져오기
//            User user = userRepository.findById(userId)
//                    .orElseThrow(() -> new NonExistUserException());
//
//            System.out.println("3");
//
//            // 프로필 이미지 경로 업데이트
//            user.setProfileImage(filePath);
//            System.out.println("4");
//
//            System.out.println("db에 save하는 데이터 : "+user);
//            System.out.println("5");
//            userRepository.save(user); // DB에 반영
//            System.out.println("6");
//
//            return filePath; // 저장된 파일 경로 반환
//        } catch (IOException e) {
//            throw new RuntimeException("파일 저장 실패", e);
//        }
//    }
    @Transactional
    public String saveFile(Long userId, MultipartFile file) {
        try {
            // 파일 경로 생성 (서버에 저장할 물리적 경로)
            String filePath = fileService.setFilePath(userId, file);

            // 파일을 실제 디렉토리에 저장
            file.transferTo(new File(filePath));

            // 사용자 정보 가져오기
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NonExistUserException());

            // 클라이언트에서 접근할 수 있는 URL 생성
            String fileUrl = fileService.getFileUrl(filePath);  // 클라이언트용 URL 생성

            // 프로필 이미지 경로를 fileUrl로 업데이트 (DB에는 fileUrl만 저장)
            user.setProfileImage(fileUrl); // 파일의 URL을 DB에 저장
            userRepository.save(user);  // DB에 반영

            return fileUrl;  // 클라이언트용 URL 반환
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }


}
