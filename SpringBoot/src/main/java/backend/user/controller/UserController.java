package backend.user.controller;

import backend.user.login.dto.LoginRequestDto;
import backend.user.login.dto.LoginResponseDto; // 💡 DTO 임포트
import backend.user.register.dto.RegisterRequestDto;
import backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/userregister.do")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto dto) {
        try {
            userService.register(dto);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 처리 중 오류가 발생했습니다.");
        }
    }

    // 💡 ResponseEntity<String> -> ResponseEntity<?> 로 변경하여 DTO 객체 리턴
    @PostMapping("/userlogin.do")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
        try {
            LoginResponseDto responseDto = userService.login(dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 처리 중 오류가 발생했습니다.");
        }
    }
}