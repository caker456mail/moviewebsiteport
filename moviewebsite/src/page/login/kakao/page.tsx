// src/pages/KakaoCallback.tsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    console.log("[Callback] 수신된 인가 코드:", code);
    console.log("[Callback] window.opener 존재 여부:", Boolean(window.opener));

    if (!code) return;

    try {
      if (window.opener) {
        // 부모 창으로 성공 메시지 전달
        window.opener.postMessage(
          { type: "KAKAO_LOGIN_SUCCESS", code },
          window.location.origin
        );
        console.log("[Callback] postMessage 전송 완료");
      } else {
        console.warn("[Callback] window.opener를 찾을 수 없습니다. (보안 정책 등으로 차단됨)");
      }
    } catch (err) {
      console.error("[Callback] 메시지 전송 중 에러 발생:", err);
    } finally {
      // 메시지 전송 여부와 관계없이 팝업창은 항상 닫히도록 처리
      window.close();
    }
  }, [code]);

  return (
    <div style={{ color: "#fff", padding: "20px", textAlign: "center", background: "#18181c", height: "100vh" }}>
      로그인 처리 중입니다. 창이 곧 닫힙니다...
    </div>
  );
}