# 1단계: 빌드용 이미지
FROM gradle:8.2.1-jdk17 AS builder

# 프로젝트 복사 및 권한 설정
COPY --chown=gradle:gradle . /app
WORKDIR /app

# 실행 가능한 bootJar 생성 (test 제외)
RUN gradle clean bootJar -x test

# 2단계: 실행용 이미지
FROM openjdk:17-jdk-slim

# builder에서 생성된 JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]
