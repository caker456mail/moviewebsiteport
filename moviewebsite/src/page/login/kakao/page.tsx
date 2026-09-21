// src/pages/LoginPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  // 1. 카카오 로그인 팝업 열기 함수
  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = "YOUR_KAKAO_REST_API_KEY";
    // 콜백 페이지 주소 (백엔드 application.yml의 kakao.redirect-uri와 완전 일치 필수)
    const REDIRECT_URI = `${window.location.origin}/oauth/kakao`; 
    
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      kakaoAuthUrl,
      "kakaoLoginPopup",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  // 2. 팝업창에서 postMessage 수신 리스너 등록
  useEffect(() => {
    const handleReceiveMessage = async (event: MessageEvent) => {
      // 보안을 위해 같은 origin인지 확인
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "KAKAO_LOGIN_SUCCESS") {
        const authCode = event.data.code;
        console.log("[Parent] 인가 코드 수신 성공:", authCode);

        try {
          // 백엔드 컨트롤러로 code 전송
          const res = await axios.post("/api/auth/kakao", { code: authCode });
          const result = res.data; // KakaoCheckResponseDto

          if (result.registered) {
            // 이미 가입된 회원 -> 로그인 성공 처리 (메인으로 이동)
            console.log("로그인 완료:", result.user);
            navigate("/");
          } else {
            // 신규 회원 -> 회원가입 페이지로 이동 (카카오 정보 전달)
            console.log("회원가입 필요:", result.socialId, result.email);
            navigate("/register/social", {
              state: {
                socialId: result.socialId,
                email: result.email,
              },
            });
          }
        } catch (error) {
          console.error("백엔드 인증 실패:", error);
          alert("카카오 로그인 처리에 실패했습니다.");
        }
      }
    };

    window.addEventListener("message", handleReceiveMessage);
    return () => window.removeEventListener("message", handleReceiveMessage);
  }, [navigate]);

  return (
    <button onClick={handleKakaoLogin}>카카오 로그인</button>
  );
} 