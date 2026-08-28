# 1. Java 17 환경 (프로젝트 Java 버전에 맞게 수정)
FROM eclipse-temurin:17-jdk-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. build/libs 폴더 안의 JAR 파일을 컨테이너로 복사
COPY build/libs/*.jar app.jar

# 4. 포트 노출
EXPOSE 8080

# 5. JAR 실행
ENTRYPOINT ["java", "-jar", "app.jar"]