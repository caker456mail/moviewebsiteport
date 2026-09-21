//package backend.user.login.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//@Getter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class KakaoCheckResponseDto {
//
//    // true면 이미 가입된 유저(로그인 처리), false면 신규 유저(회원가입 필요)
//    private boolean isRegistered;
//
//    // 카카오에서 발급해 준 고유 ID (회원가입 시 DB의 socialId 컬럼에 저장할 값)
//    private String socialId;
//
//    // 카카오 계정의 이메일 (있을 경우 회원가입 폼에 미리 채워주기 위함)
//    private String email;
//
//    // 이미 가입된 유저일 경우 기존 로그인 응답 객체 (미가입 시 null)
//    private LoginResponseDto user;
//}