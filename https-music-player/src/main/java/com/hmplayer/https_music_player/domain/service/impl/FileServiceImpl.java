package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.dto.response.music.UploadResponse;
import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final UserRepoService userRepoService;
    private final UserRepository userRepository;


    @Value("${file.path}")
    private String filePath;

    @Value("${file.url}")
    private String fileUrl;

    @Override
    public ResponseEntity<? super UploadResponse> upload(MultipartFile file, String email) {

        if(file.isEmpty()) {
            return null;
        }

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        String saveFileName = uuid + extension;

        String savePath = filePath + saveFileName;
        try{

            file.transferTo(new File(savePath));

        }catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        System.out.println("fileUrl : "+ fileUrl);
        System.out.println("saveFileName : "+ saveFileName);

        String url = fileUrl + saveFileName;
        System.out.println("url : "+ url);

        // user 정보 가져옴
        User user = userRepoService.findByEmail(email);
        // 가져온 정보중 프로필 이미지에 대한 데이터를 방금 생성한 url로 set
        user.setProfileImage(url);
        // 그리고 저장
        userRepository.save(user);


        return UploadResponse.success(url);
    }

    @Override
    public Resource getImage(String fileName) {
        Resource resource = null;

        try{
            resource = new UrlResource("file:" + filePath + fileName);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }

        return resource;

    }

}
