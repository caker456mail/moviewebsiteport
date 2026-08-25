import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// 임시 예매 내역 데이터 (실제 서비스에서는 API로 조회)
const MOCK_BOOKINGS = [
  {
    id: "BK109283",
    cinema: "CGV",
    district: "안산시 단원구",
    movieTitle: "인터스텔라",
    time: "14:30",
    date: "2026.03.01",
    adultCount: 2,
    youthCount: 0,
    seats: ["A3", "A4"],
    totalPrice: 30000,
    status: "예매완료",
  },
  {
    id: "BK108112",
    cinema: "메가박스",
    district: "수원시 팔달구",
    movieTitle: "파묘",
    time: "19:10",
    date: "2026.02.14",
    adultCount: 1,
    youthCount: 1,
    seats: ["C5", "C6"],
    totalPrice: 26000,
    status: "관람완료",
  },
];

// 임시 위시리스트 영화 데이터
const MOCK_WISHLIST = [
  { id: 101, title: "오펜하이머", genre: "스릴러/드라마" },
  { id: 102, title: "듄: 파트 2", genre: "SF/액션" },
];

export default function MyPage() {
  // 1. localStorage에서 저장된 유저 정보 가져오기
  const [user, setUser] = useState<{
    username?: string;
    email?: string;
    phone?: string;
    membership?: string;
    points?: number;
    coupons?: number;
  }>({
    username: "사용자",
    email: "user@example.com",
    phone: "010-0000-0000",
    membership: "VIP",
    points: 12500,
    coupons: 3,
  });

  useEffect(() => {
    // localStorage에 'user' 키로 저장되어 있는지 확인
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser((prev) => ({
          ...prev,
          username: parsed.username || parsed.name || "사용자",
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
        }));
      } catch (e) {
        console.error("localStorage 파싱 에러:", e);
      }
    }
  }, []);

  // 사이드바 선택 메뉴 상태
  const [selectedMenu, setSelectedMenu] = useState<
    "bookings" | "wishlist" | "coupons" | "editProfile" | "changePassword"
  >("bookings");

  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);

  // 비밀번호 변경 Form 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 회원정보 수정 Form 상태
  const [userInfo, setUserInfo] = useState({
    username: "",
    phone: "",
  });

  // user 정보가 로드되면 form 초기값 동기화
  useEffect(() => {
    setUserInfo({
      username: user.username || "",
      phone: user.phone || "",
    });
  }, [user]);

  // 예매 취소 처리
  const handleCancelBooking = (id: string) => {
    if (confirm("정말 예매를 취소하시겠습니까?")) {
      setBookings((prev) => prev.filter((item) => item.id !== id));
      alert("예매가 취소되었습니다.");
    }
  };

  // 위시리스트 삭제 처리
  const handleRemoveWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    alert("위시리스트에서 삭제되었습니다.");
  };

  // 비밀번호 변경 submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("비밀번호가 성공적으로 변경되었습니다.");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // 회원정보 수정 submit (localStorage 업데이트)
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      username: userInfo.username,
      phone: userInfo.phone,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("회원정보가 수정되었습니다.");
  };

  // 로그아웃 처리
  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
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
        }}
      >
        <div
          style={{
            padding: "40px 20px 60px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* 상단 프로필 헤더 (localStorage에서 유저 정보 불러옴) */}
          <section
            style={{
              backgroundColor: "#18181c",
              padding: "24px 30px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#e50914",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {user.username ? user.username[0] : "U"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                    {user.username} 님
                  </h1>
                  <span
                    style={{
                      backgroundColor: "rgba(229, 9, 20, 0.2)",
                      color: "#ff4d4d",
                      border: "1px solid rgba(229, 9, 20, 0.4)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.membership || "VIP"}
                  </span>
                </div>
                <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "4px" }}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* 유저 요약 수치 */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                backgroundColor: "#222228",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1px solid #2e2e36",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#aaa" }}>포인트</span>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#ff4d4d",
                    marginTop: "2px",
                  }}
                >
                  {(user.points || 0).toLocaleString()} P
                </div>
              </div>
              <div style={{ width: "1px", backgroundColor: "#3a3a42" }} />
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#aaa" }}>보유 쿠폰</span>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#fff",
                    marginTop: "2px",
                  }}
                >
                  {user.coupons || 0}장
                </div>
              </div>
            </div>
          </section>

          {/* 메인 콘텐츠 영역: (좌) 사이드바 메뉴 | (우) 상세 내용 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "30px",
              alignItems: "start",
            }}
          >
            {/* 1. 좌측 사이드바 메뉴 */}
            <aside
              style={{
                backgroundColor: "#18181c",
                borderRadius: "16px",
                border: "1px solid #2a2a30",
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  color: "#666",
                  fontWeight: "bold",
                }}
              >
                나의 활동
              </div>
              <button
                onClick={() => setSelectedMenu("bookings")}
                style={getSidebarStyle(selectedMenu === "bookings")}
              >
                🎟️ 예매 내역
              </button>
              <button
                onClick={() => setSelectedMenu("wishlist")}
                style={getSidebarStyle(selectedMenu === "wishlist")}
              >
                ❤️ 찜한 영화
              </button>
              <button
                onClick={() => setSelectedMenu("coupons")}
                style={getSidebarStyle(selectedMenu === "coupons")}
              >
                🎁 쿠폰 & 포인트
              </button>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "#2a2a30",
                  margin: "12px 0 4px",
                }}
              />

              <div
                style={{
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  color: "#666",
                  fontWeight: "bold",
                }}
              >
                계정 설정
              </div>
              <button
                onClick={() => setSelectedMenu("editProfile")}
                style={getSidebarStyle(selectedMenu === "editProfile")}
              >
                👤 회원정보 수정
              </button>
              <button
                onClick={() => setSelectedMenu("changePassword")}
                style={getSidebarStyle(selectedMenu === "changePassword")}
              >
                🔒 비밀번호 변경
              </button>

              <button
                onClick={handleLogout}
                style={{
                  ...getSidebarStyle(false),
                  color: "#ff4d4d",
                  marginTop: "12px",
                }}
              >
                🚪 로그아웃
              </button>
            </aside>

            {/* 2. 우측 상세 컨텐츠 영역 */}
            <main
              style={{
                backgroundColor: "#18181c",
                borderRadius: "16px",
                border: "1px solid #2a2a30",
                padding: "30px",
                minHeight: "500px",
              }}
            >
              {/* [메뉴 1] 예매 내역 */}
              {selectedMenu === "bookings" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>
                    예매 내역
                  </h2>
                  {bookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                      예매 내역이 존재하지 않습니다.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {bookings.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: "#222228",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #2a2a30",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div
                              style={{ fontSize: "0.85rem", color: "#ff4d4d", marginBottom: "4px" }}
                            >
                              [{item.cinema}] {item.district} | 예매번호: {item.id}
                            </div>
                            <h3
                              style={{
                                fontSize: "1.15rem",
                                fontWeight: "bold",
                                marginBottom: "8px",
                              }}
                            >
                              {item.movieTitle}
                            </h3>
                            <div style={{ color: "#aaa", fontSize: "0.85rem", lineHeight: "1.5" }}>
                              일시: {item.date} ({item.time}) <br />
                              좌석: {item.seats.join(", ")} ({item.adultCount + item.youthCount}명)
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                              {item.totalPrice.toLocaleString()} 원
                            </div>
                            {item.status === "예매완료" ? (
                              <Button
                                title="예매 취소"
                                isSelected={false}
                                onClick={() => handleCancelBooking(item.id)}
                              />
                            ) : (
                              <span
                                style={{ color: "#888", fontSize: "0.8rem", textAlign: "center" }}
                              >
                                {item.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* [메뉴 2] 찜한 영화 */}
              {selectedMenu === "wishlist" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>
                    찜한 영화 목록
                  </h2>
                  {wishlist.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
                      찜한 영화가 없습니다.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "20px",
                      }}
                    >
                      {wishlist.map((movie) => (
                        <Card
                          key={movie.id}
                          image={movie.title}
                          title={movie.title}
                          genre={movie.genre}
                          BT={
                            <Button
                              title="삭제"
                              width="100%"
                              isSelected={false}
                              onClick={() => handleRemoveWishlist(movie.id)}
                            />
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* [메뉴 3] 쿠폰 & 포인트 */}
              {selectedMenu === "coupons" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>
                    쿠폰 & 포인트
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={couponItemStyle}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>[신규가입] 영화 3,000원 할인쿠폰</div>
                        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: "4px" }}>
                          유효기간: ~2026.12.31 까지
                        </div>
                      </div>
                      <span
                        style={{ color: "#ff4d4d", fontSize: "0.85rem", fontWeight: "bold" }}
                      >
                        사용 가능
                      </span>
                    </div>
                    <div style={couponItemStyle}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>[VIP 전용] 매점 콤보 2,000원 할인쿠폰</div>
                        <div style={{ color: "#888", fontSize: "0.8rem", marginTop: "4px" }}>
                          유효기간: ~2026.06.30 까지
                        </div>
                      </div>
                      <span
                        style={{ color: "#ff4d4d", fontSize: "0.85rem", fontWeight: "bold" }}
                      >
                        사용 가능
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* [메뉴 4] 회원정보 수정 */}
              {selectedMenu === "editProfile" && (
                <div style={{ maxWidth: "480px" }}>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>
                    회원정보 수정
                  </h2>
                  <form
                    onSubmit={handleProfileSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                  >
                    <div>
                      <label style={labelStyle}>이메일 (아이디)</label>
                      <input
                        type="text"
                        value={user.email || ""}
                        disabled
                        style={{ ...inputStyle, backgroundColor: "#111115", color: "#666" }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>사용자 이름 (Username)</label>
                      <input
                        type="text"
                        value={userInfo.username}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, username: e.target.value })
                        }
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>전화번호</label>
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, phone: e.target.value })
                        }
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Button title="회원정보 저장" isSelected={true} width="100%" />
                    </div>
                  </form>
                </div>
              )}

              {/* [메뉴 5] 비밀번호 변경 */}
              {selectedMenu === "changePassword" && (
                <div style={{ maxWidth: "480px" }}>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>
                    비밀번호 변경
                  </h2>
                  <form
                    onSubmit={handlePasswordSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                  >
                    <div>
                      <label style={labelStyle}>현재 비밀번호</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        style={inputStyle}
                        placeholder="현재 비밀번호 입력"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>새 비밀번호</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        style={inputStyle}
                        placeholder="새 비밀번호 입력"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>새 비밀번호 확인</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        style={inputStyle}
                        placeholder="새 비밀번호 재입력"
                        required
                      />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Button title="비밀번호 변경 저장" isSelected={true} width="100%" />
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

// Inline Style Helper Functions
const getSidebarStyle = (isSelected: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  padding: "12px 16px",
  backgroundColor: isSelected ? "#e50914" : "transparent",
  color: isSelected ? "#fff" : "#aaa",
  border: "none",
  borderRadius: "10px",
  fontSize: "0.95rem",
  fontWeight: isSelected ? "bold" : "normal",
  cursor: "pointer",
  transition: "all 0.2s ease",
});

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  color: "#aaa",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "#222228",
  border: "1px solid #33333d",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
};

const couponItemStyle: React.CSSProperties = {
  padding: "16px 20px",
  backgroundColor: "#222228",
  borderRadius: "10px",
  border: "1px solid #2a2a30",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};