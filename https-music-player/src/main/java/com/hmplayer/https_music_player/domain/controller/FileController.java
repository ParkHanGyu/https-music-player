package com.hmplayer.https_music_player.domain.controller;

import com.hmplayer.https_music_player.domain.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) {
        System.out.println("upload 컨트롤러 실행");

        String url = fileService.upload(file);
        System.out.println("upload 컨트롤러 return 값 : " + url);

        return url;
    }

    @GetMapping(value = "{fileName}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public Resource getImage(@PathVariable("fileName") String fileName) {
        System.out.println("getImage 컨트롤러 실행");

        Resource resource = fileService.getImage(fileName);
        System.out.println("getImage 컨트롤러 return 값 : " + resource);

        return resource;
    }
}
