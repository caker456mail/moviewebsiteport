import { MenuItem } from "@/feature/Menu/MenuItem";
import { useState, useEffect } from "react";
import { UserInfo } from "./loginService"; // 💡 UserInfo 타입 임포트 (경로는 맞춰서 수정)

export default function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // 💡 DB 구조에 맞게 UserInfo 타입 지정
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // 페이지 진입 시 localStorage에서 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData: UserInfo = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("사용자 정보 파싱 에러:", e);
      }
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    window.location.href = "/";
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#1f1f1f",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        onClick={() => (window.location.href = "/")}
        style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#e50914", cursor: "pointer" }}
      >
        🎬 MOVIE
      </div>

      <nav style={{ display: "flex", gap: "30px" }}>
        {MenuItem.map((item) => (
          <a
            key={item.id}
            href={item.path}
            style={{
              color: item.id === 1 ? "#fff" : "#aaa",
              textDecoration: "none",
              fontWeight: item.id === 1 ? "bold" : "normal",
            }}
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center" }}>
        {isLoggedIn && user ? (
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {/* 💡 아바타 (이름의 첫 글자 표시) */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e50914 0%, #9b0000 100%)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>

              {/* 💡 DB에서 가져온 사용자 이름 (user.name -> user.username) */}
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>
                {user.username} 님
              </span>

              <span style={{ color: "#aaa", fontSize: "10px" }}>
                {showDropdown ? "▲" : "▼"}
              </span>
            </div>

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: "0",
                  width: "140px",
                  backgroundColor: "#141414",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <a
                  href="/profile"
                  style={{
                    display: "block",
                    padding: "10px 15px",
                    color: "#ddd",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  마이페이지
                </a>
                <div style={{ height: "1px", backgroundColor: "#333" }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    color: "#e50914",
                    fontSize: "13px",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            style={{
              padding: "8px 18px",
              backgroundColor: "#e50914",
              color: "#fff",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              borderRadius: "4px",
            }}
          >
            로그인
          </a>
        )}
      </div>
    </header>
  );
}