package com.hmplayer.https_music_player;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class HttpsMusicPlayerApplication {

	public static void main(String[] args) {
		SpringApplication.run(HttpsMusicPlayerApplication.class, args);
	}

}
