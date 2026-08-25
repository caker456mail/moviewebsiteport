package backend.user.register.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {
    private String id;
    private String email;
    private String password;
    private String phone;
}