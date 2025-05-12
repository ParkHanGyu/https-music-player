package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.dto.response.music.UploadResponse;
import com.hmplayer.https_music_player.domain.dto.response.user.GetLoginUserResponse;
import com.hmplayer.https_music_player.domain.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload/profile")
    public ResponseEntity<? super UploadResponse> upload(@RequestParam("file") MultipartFile file , @RequestParam("prevImageUrl") String prevImageUrl, @AuthenticationPrincipal String email) {
        System.out.println("upload 컨트롤러 실행");
        return fileService.upload(file,prevImageUrl,email);
    }

    @GetMapping(value = "/image/{fileName}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public Resource getImage(@PathVariable("fileName") String fileName) {
        System.out.println("getImage 컨트롤러 실행");

        Resource resource = fileService.getImage(fileName);
        System.out.println("getImage 컨트롤러 return 값 : " + resource);

        return resource;
    }
}
