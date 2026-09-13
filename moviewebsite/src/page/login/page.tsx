import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/service/loginUserdata";

export default function Login() {
    const [email, setId] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    // 💡 발급받으신 REST API 키 적용
    const REST_API_KEY = "758a5716c21d9bd249cb724a9106650f"; 
    // ※ 카카오 개발자 콘솔에 등록된 Redirect URI와 정확히 일치해야 합니다.
    const REDIRECT_URI = "http://localhost:5173/auth/kakao/callback";
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

    // 팝업창에서 보낸 메시지(로그인 결과) 감지
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === "KAKAO_LOGIN_SUCCESS") {
                alert("카카오 로그인 성공!");
                nav("/");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [nav]);

    // 팝업창 열기
    const handleKakaoLogin = () => {
        const width = 480;
        const height = 640;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            KAKAO_AUTH_URL,
            "KakaoLoginPopup",
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=no`
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        const success = await loginUser({ email, password });
        if (success) {
            alert("로그인 성공!");
            nav("/");
        }
    };

    const registerhandleSubmit = () => {
        nav("/register");
    };

    return (
        <>
            <div
                style={{
                    backgroundColor: "#0f0f12",
                    color: "#fff",
                    minHeight: "100vh",
                    fontFamily: "sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "60px 20px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#18181c",
                            padding: "40px",
                            borderRadius: "20px",
                            border: "1px solid #2a2a30",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                            width: "100%",
                            maxWidth: "420px",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.8rem",
                                fontWeight: "700",
                                marginBottom: "24px",
                                textAlign: "center",
                                color: "#fff",
                            }}
                        >
                            로그인
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "6px" }}>
                                    이메일
                                </label>
                                <input
                                    type="text"
                                    placeholder="이메일을 입력하세요"
                                    value={email}
                                    onChange={(e) => setId(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #2e2e36",
                                        backgroundColor: "#222228",
                                        color: "#fff",
                                        fontSize: "0.95rem",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "6px" }}>
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #2e2e36",
                                        backgroundColor: "#222228",
                                        color: "#fff",
                                        fontSize: "0.95rem",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <Button title="로그인" width="100%" isSelected={true} type="submit" />
                                    <Button
                                        title="회원가입"
                                        width="100%"
                                        isSelected={true}
                                        type="button"
                                        onClick={registerhandleSubmit}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
                                <div style={{ flex: 1, height: "1px", backgroundColor: "#2e2e36" }} />
                                <span style={{ padding: "0 10px", fontSize: "0.8rem", color: "#666" }}>또는</span>
                                <div style={{ flex: 1, height: "1px", backgroundColor: "#2e2e36" }} />
                            </div>

                            <button
                                type="button"
                                onClick={handleKakaoLogin}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "#FEE500",
                                    color: "#000000",
                                    fontSize: "0.95rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                카카오로 로그인
                            </button>
                        </form>
                    </div>
                </div>
            
            </div>
        </>
    );
}