package com.hmplayer.https_music_player.domain.service;

import com.hmplayer.https_music_player.domain.dto.response.music.UploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    ResponseEntity<? super UploadResponse> upload(MultipartFile file, String prevImageUrl,String email);
    Resource getImage(String fileName);
}
