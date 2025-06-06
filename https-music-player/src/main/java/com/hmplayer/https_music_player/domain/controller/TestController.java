package com.hmplayer.https_music_player.domain.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Slf4j
@RequestMapping("/api")
public class TestController {
    @GetMapping("/hello")
    public String hello() {
        return "hi, return";
    }

}
