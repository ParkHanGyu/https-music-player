package com.hmplayer.https_music_player.domain.service.impl;

import com.hmplayer.https_music_player.domain.common.customexception.*;
import com.hmplayer.https_music_player.domain.dto.request.auth.AuthNumberCheckRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.AuthNumberRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignInRequest;
import com.hmplayer.https_music_player.domain.dto.request.auth.SignUpRequest;
import com.hmplayer.https_music_player.domain.dto.response.auth.*;
import com.hmplayer.https_music_player.domain.jpa.entity.User;
import com.hmplayer.https_music_player.domain.jpa.jpaInterface.UserRepository;
import com.hmplayer.https_music_player.domain.jpa.service.UserRepoService;
import com.hmplayer.https_music_player.domain.security.JwtSecurity;
import com.hmplayer.https_music_player.domain.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.angus.mail.util.logging.MailHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepoService userRepoService;
    private final UserRepository userRepository;
    private final JwtSecurity jwtSecurity;
    private final JavaMailSender javaMailSender;
    // Redis
    private final RedisTemplate<String, String> redisTemplate;
    // BCrypt 해싱
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    // Argon2 해싱
    private PasswordEncoder argon2PasswordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8(); // 또는 new Argon2PasswordEncoder(...) 로 직접 파라미터 설정


    @Override
    public ResponseEntity<? super SignUpResponse> signUp(SignUpRequest request) {
        try {
            // 중복 회원(이메일)
            Optional<User> findExistingUser = userRepoService.existCheckEmail(request.getEmail());
            if (findExistingUser.isPresent()) return SignUpResponse.existingUser();

            String password = passwordEncoder.encode(request.getPassword());
            User user = SignUpRequest.of(request, password);
            userRepoService.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return SignUpResponse.databaseError();
        }
        return SignUpResponse.sucess();
    }

    
    // 로그인 요청
    @Override
    public ResponseEntity<? super SignInResponse> signIn(SignInRequest request) {
        System.out.println("클라이언트에서 받은 request.getPassword()값 : "+request.getPassword());
        String accessToken = "";
        String refreshToken = "";
        int accessTokenExpirationTime = 0;
        int refreshTokenExpirationTime = 0;

        try {
            User user = userRepoService.findByEmail(request.getEmail());
//            if (!user.getActive()) return SignInResponse.loginFail(); // 회원탈퇴 기능 생기면 추가하기

            String encodedPassword = user.getPassword();
            System.out.println("클라이언트에서 받은 encodedPassword값 : "+encodedPassword);

            System.out.println("request.getPassword() : " + request.getPassword());
            System.out.println("BCrypt 해싱 이후 패스워드 값 : " + passwordEncoder.encode(request.getPassword()));
            System.out.println("Argon2 해싱 이후 패스워드 값 : " + argon2PasswordEncoder.encode(request.getPassword()));



            // 입력한 비번과 db에 있는 비번이 일치한지 확인
            boolean isMatched = passwordEncoder.matches(request.getPassword(), encodedPassword);
            if (!isMatched) return SignInResponse.loginFail();

            accessToken = jwtSecurity.createAccessToken(user.getEmail());
            refreshToken = jwtSecurity.createRefreshToken(user.getEmail());


            accessTokenExpirationTime = jwtSecurity.extractExpiration(accessToken);
            refreshTokenExpirationTime = jwtSecurity.extractExpiration(refreshToken);

        } catch (NonExistUserException e) {
            System.out.println("NoSuchElementException 실행");
            return SignInResponse.loginFail(); // 사용자 없음 응답
        } catch (Exception e) {
            System.out.println("Exception 실행");
            e.printStackTrace();
            SignInResponse.databaseError();
        }
        return SignInResponse.success(accessToken, refreshToken, accessTokenExpirationTime, refreshTokenExpirationTime);
    }




    @Override
    public ResponseEntity<? super accessTokenReissueResponse> refreshAccessToken(String token) {
        int newAccessTokenExpirationTime = 0;
// 1. "Bearer " 접두사 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            // 2. 이메일 추출 + 검증
            String email = jwtSecurity.validate(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid refresh token payload.");
            }

            // 3. 새 액세스 토큰 생성
            String newAccessToken = jwtSecurity.createAccessToken(email);

            System.out.println("원래 token : " + token);
            System.out.println("새로운 Token : " + newAccessToken);

            // + 토큰 유효시간 추출
            newAccessTokenExpirationTime = jwtSecurity.extractExpiration(newAccessToken);

            System.out.println("클라이언트에 보낼 데이터 : " + new accessTokenReissueResponse(newAccessToken, newAccessTokenExpirationTime));

            // 4. 응답 생성
            return accessTokenReissueResponse.success(newAccessToken, newAccessTokenExpirationTime);
//            return null;

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error refreshing access token.");
        }
    }

//    @Override
//    public ResponseEntity <?> authNumberSend(HttpSession session, String userEmail) {
//
//        MailHandler mailHandler = new MailHandler(javaMailSender);
//
//
//        return null;
//    }

//    private String senderEmail = "qkrgksrl0033@gmail.com";

    @Value("${mail.username}")
    private String senderEmail;




    // 이메일 인증 (중복 확인 -> 중복 아닐 경우 인증번호 발송해주기)
    @Override
    public ResponseEntity<? super AuthNumberSendResponse> authNumberSend(AuthNumberRequest request) {

        // 0. 중복 회원(이메일)
//        Optional<User> findExistingUser = userRepoService.existCheckEmail(request.getEmail());
//        if (findExistingUser.isPresent()) return SignUpResponse.existingUser();

        // request.getEmail() 데이터가 db에 '존재할경우' 예외 발생
        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new EmailDuplicatedException(request.getEmail());
                });


        // 1. 인증번호 생성
        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(3);
            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 97)); // 소문자
                case 1 -> key.append((char) (random.nextInt(26) + 65)); // 대문자
                case 2 -> key.append(random.nextInt(10));               // 숫자
            }
        }

        String randomNumber = key.toString();
        log.info("만들어진 인증번호 = {}", randomNumber);
        // =====================================================================================

        // 2. 인증번호 저장
        String redisKey = "email:auth:" + request.getEmail();

        // 외부 리소스를 사용 할 경우 try + catch를 사용하는게 정석
        try {
            // Redis에 인증번호 저장 (3분 후 만료)
            redisTemplate.opsForValue().set(redisKey, randomNumber, 1, TimeUnit.MINUTES);
        } catch(RedisConnectionFailureException e) {
            throw new RedisException();
        }


        // 3. 이메일 발송
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, request.getEmail());
            message.setSubject("이메일 인증");

            String html = """
            <h3>요청하신 인증 번호입니다.</h3>
            <h1>%s</h1>
            <h3>감사합니다.</h3>
        """.formatted(randomNumber);

            message.setText(html, "UTF-8", "html");
            javaMailSender.send(message);
        }catch (Exception e) {
            log.error("이메일 발송 실패", e);
        }





        Long redisExpireTime = redisTemplate.getExpire(redisKey, TimeUnit.SECONDS);
        int expireTime = redisExpireTime != null ? redisExpireTime.intValue() : 0;


        return AuthNumberSendResponse.success(expireTime);
    }


    @Override
    public ResponseEntity<? super AuthNumberCheckResponse> authNumberCheck(AuthNumberCheckRequest request) {
        // 사용자가 입력한 eamil
        String email = request.getEmail();
        // 사용자가 보내준 인증번호
        String authNumber = request.getAuthNumber();

        String redisKey = "email:auth:" + email;
        // 서버에 저장되어 있는 인증번호
        String redisAuthNumber = redisTemplate.opsForValue().get(redisKey);

        log.info("클라이언트에서 받아온 데이터 - 이메일 = {}, 코드 = {}", email, authNumber);
        log.info("Redis에 저장된 코드 = {}", redisAuthNumber);

        if (redisAuthNumber == null) {
            // 인증번호가 존재하지 않음 (시간 초과 or 잘못된 이메일 => 애초에 저런 이메일로 저장한 적이 없는 경우)
            throw new AuthNumberNullException(email);
        }

        if (!redisAuthNumber.equals(authNumber)) {
            // 인증번호 불일치
            throw new AuthNumberMismatchException(authNumber);
        }

        // 인증 성공 시 Redis에서 해당 인증번호 삭제 (선택)
        redisTemplate.delete(redisKey);

        // 성공 응답
        return AuthNumberCheckResponse.success();
    }







}
