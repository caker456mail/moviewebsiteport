package backend.user.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", schema = "admin")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder // 👈 추가
public class User {

    // UUID 기본키 설정 (gen_random_uuid() 대응)
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", updatable = false, nullable = false)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash; // 소셜 가입 시 null 허용

    @Column(nullable = false, length = 100)
    private String username;

    @Column(name = "phone_number", unique = true, length = 20)
    private String phoneNumber;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 20)
    private String role; // USER, ADMIN

    @Column(length = 20)
    private String status; // ACTIVE, SUSPENDED, DELETED

    @Column(name = "auth_provider", length = 20)
    private String authProvider; // LOCAL, KAKAO, NAVER, GOOGLE, FACEBOOK

    @Column(name = "social_id")
    private String socialId;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;
}