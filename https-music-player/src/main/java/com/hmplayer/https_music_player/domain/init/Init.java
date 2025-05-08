package com.hmplayer.https_music_player.domain.init;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class Init {

    @Value("${file.path}")
    private String filePath;

    @PostConstruct  // 애플리케이션 실행 후 자동 호출됨
    private void createUploadDir() {
        File uploadDir = new File(filePath);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            if (created) {
                System.out.println("업로드 폴더 생성 완료");
            } else {
                System.err.println("업로드 폴더 생성 실패");
            }
        }
    }
}
