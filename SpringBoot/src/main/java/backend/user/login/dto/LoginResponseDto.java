package backend.user.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponseDto {
    private UUID userId;
    private String email;
    private String username;
    private String phoneNumber;
    private LocalDate birthDate;
    private String role;
    private String status;
    private String authProvider;
    private OffsetDateTime createdAt;
}