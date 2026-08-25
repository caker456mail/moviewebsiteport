import { useState } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/service/loginUserdata"; // 💡 로그인 API 서비스 연결

export default function Login() {
    const [email, setId] = useState(""); // 💡 email -> email 변수명 변경
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    // 💡 백엔드와 연동하는 비동기 로그인 처리 함수
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        // 로그인 API 호출
        const success = await loginUser({ email, password });

        if (success) {
            alert("로그인 성공!");
            nav("/"); // 로그인 성공 시 메인 페이지로 이동
        }
    };

    const registerhandleSubmit = () => {
        nav("/register");
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
                                    {/* 💡 로그인 버튼 type="submit" 연결 */}
                                    <Button title="로그인" width="100%" isSelected={true} type="submit" />
                                    
                                    {/* 💡 회원가입 버튼 type="button" 지정 */}
                                    <Button
                                        title="회원가입"
                                        width="100%"
                                        isSelected={true}
                                        type="button"
                                        onClick={registerhandleSubmit}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}