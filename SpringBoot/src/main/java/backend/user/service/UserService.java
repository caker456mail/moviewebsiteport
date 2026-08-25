package backend.user.service;

import backend.user.domain.User;
import backend.user.login.dto.LoginResponseDto; // 💡 DTO 임포트
import backend.user.register.dto.RegisterRequestDto;
import backend.user.register.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .username(dto.getId())
                .email(dto.getEmail())
                .passwordHash(encodedPassword)
                .phoneNumber(dto.getPhone())
                .role("USER")
                .status("ACTIVE")
                .authProvider("LOCAL")
                .build();

        userRepository.save(user);
    }

    // 💡 boolean -> LoginResponseDto 로 반환 타입 변경
    @Transactional(readOnly = true)
    public LoginResponseDto login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 💡 로그인 성공 시 DB 유저 정보 객체 반환
        return LoginResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .phoneNumber(user.getPhoneNumber())
                .birthDate(user.getBirthDate())
                .role(user.getRole())
                .status(user.getStatus())
                .authProvider(user.getAuthProvider())
                .createdAt(user.getCreatedAt())
                .build();
    }
}