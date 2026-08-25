package backend.user.login.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequestDto {
    private String email;        // 프론트엔드의 id
    private String password;  // 프론트엔드의 password
}