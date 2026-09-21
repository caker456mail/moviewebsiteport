//package backend.user.login.controller;
//
//import backend.user.login.dto.KakaoCheckResponseDto;
//import backend.user.login.dto.KakaoLoginRequestDto;
//import backend.user.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final UserService userService;
//
//    /**
//     * 프론트엔드에서 카카오 인가 코드를 받아 회원 여부 확인
//     * POST /api/auth/kakao
//     */
//    @PostMapping("/kakao")
//    public ResponseEntity<KakaoCheckResponseDto> checkKakaoUser(@RequestBody KakaoLoginRequestDto request) {
//        KakaoCheckResponseDto response = userService.checkKakaoUser(request.getCode());
//        return ResponseEntity.ok(response);
//    }
//}