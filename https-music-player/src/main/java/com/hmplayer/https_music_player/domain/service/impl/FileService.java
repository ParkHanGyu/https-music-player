package com.hmplayer.https_music_player.domain.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RequiredArgsConstructor
@Service
public class FileService {

    @Value("${file.path}")
    private String filePath;

    @Value("${file.url}")
    private String fileUrl;

    // 파일 저장 경로 생성 (서버에 저장할 물리적 경로)
    public String setFilePath(Long userId, MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = userId + "_" + System.currentTimeMillis() + fileExtension;
        return filePath + newFilename;  // 서버에 저장할 실제 경로 반환
    }

    // 클라이언트에서 접근할 수 있는 URL 생성
    public String getFileUrl(String filePath) {
        // 파일 경로에서 파일명만 추출
        String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        return fileUrl + fileName;  // 클라이언트에서 사용할 수 있는 URL 반환
    }


}
