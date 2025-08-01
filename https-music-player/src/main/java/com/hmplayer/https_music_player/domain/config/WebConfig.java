package com.hmplayer.https_music_player.domain.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.static-resource-path}")
    private String staticResourcePath;

    // CORS 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("http://localhost:3001")
                .allowedOrigins("https://parkhangyu.github.io") // 허용할 출처
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메소드
                .allowCredentials(true); // 쿠키 및 인증 정보를 포함하려면 true로 설정
    }

    // 정적 리소스 설정
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("staticResourcePath : " + staticResourcePath);
        registry
                .addResourceHandler("/images/**")
                .addResourceLocations(staticResourcePath);
    }
}
