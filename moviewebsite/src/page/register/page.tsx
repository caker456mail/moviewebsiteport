import { useState } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { registerUserdata } from "@/service/registerUserdata"; // 💡 서비스 함수 추가

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [phone, setPhone] = useState("");
    const nav = useNavigate();

    // 💡 폼 제출 및 서비스 호출 통합 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !id || !phone) {
            alert("비어있는 칸을 입력해주세요.");
            return;
        }

        const success = await registerUserdata({
            id,
            email,
            password,
            phone,
        });

        if (success) {
            alert("회원가입이 완료되었습니다!");
            nav("/login");
        } else {
            alert("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
        }
    };

    const handleSocialLogin = (provider: string) => {
        alert(`${provider} 로그인/인증 시도`);
    };

    return (
        <>
            <Menu />
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
                            회원가입
                        </h2>

                        {/* 💡 form 태그에 onSubmit 연결 */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "6px" }}>
                                    이름
                                </label>
                                <input
                                    type="text"
                                    placeholder="이름을 입력하세요"
                                    value={id}
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
                                    이메일 주소
                                </label>
                                <input
                                    type="email"
                                    placeholder="example@naver.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "6px" }}>
                                    핸드폰번호
                                </label>
                                <input
                                    type="tel"
                                    placeholder="01012345678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
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

                            <div style={{ margin: "10px 0 6px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#2e2e36" }} />
                                    <span style={{ padding: "0 10px", fontSize: "0.8rem", color: "#888" }}>
                                        간편 소셜 인증
                                    </span>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#2e2e36" }} />
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "16px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin("Google")}
                                        title="구글 로그인"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "50%",
                                            border: "1px solid #2e2e36",
                                            backgroundColor: "#ffffff",
                                            color: "#000",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        G
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin("Kakao")}
                                        title="카카오 로그인"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: "#FEE500",
                                            color: "#3c1e1e",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        K
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin("Naver")}
                                        title="네이버 로그인"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: "#03C75A",
                                            color: "#ffffff",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        N
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin("Facebook")}
                                        title="페이스북 로그인"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: "#1877F2",
                                            color: "#ffffff",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        f
                                    </button>
                                </div>
                            </div>

                            {/* 💡 Button의 type을 "submit"으로 설정하여 폼 제출 동작 연동 */}
                            <div style={{ marginTop: "10px" }}>
                                <Button title="회원가입" width="100%" isSelected={true} type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}