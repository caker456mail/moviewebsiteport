import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { TOP_MOVIES } from "@/hardCordingData/MainTopMovie";

const TIME_SLOTS = ["10:30", "13:45", "16:30", "19:15", "22:00"];
const ROWS = ["A", "B", "C", "D", "E"];
const PRICE_PER_SEAT = 15000;

export default function MainPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(TOP_MOVIES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // 3초 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOP_MOVIES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  return (
    <div style={{ backgroundColor: "#0f0f12", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* 1. 헤더 / 사이드바 */}
      <Sidebar />

      {/* 2. 메인 캐러셀 (카드 배너 스타일) */}
      <section style={{ padding: "30px 40px 0", maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            height: "440px",
            overflow: "hidden",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          {TOP_MOVIES.map((movie, index) => (
            <div
              key={movie.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, rgba(229, 9, 20, 0.4) 0%, rgba(18, 18, 18, 0.95) 70%), ${movie.bg}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 60px",
                opacity: currentSlide === index ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
                pointerEvents: currentSlide === index ? "auto" : "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "rgba(229, 9, 20, 0.2)",
                  color: "#ff4d4d",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  width: "fit-content",
                  border: "1px solid rgba(229, 9, 20, 0.4)",
                  backdropFilter: "blur(4px)",
                }}
              >
                🔥 TOP {index + 1} MOVIE
              </span>
              <h1 style={{ fontSize: "3.5rem", margin: "15px 0 10px", fontWeight: "800", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                {movie.title}
              </h1>
              <p style={{ color: "#ddd", fontSize: "1.15rem", maxWidth: "600px", lineHeight: "1.6", marginBottom: "15px" }}>
                {movie.desc}
              </p>
              <small style={{ color: "#aaa", fontSize: "0.95rem" }}>장르: {movie.genre}</small>
            </div>
          ))}

          {/* Indicators */}
          <div style={{ position: "absolute", bottom: "25px", right: "40px", display: "flex", gap: "10px" }}>
            {TOP_MOVIES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: currentSlide === index ? "#e50914" : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>

{/* 3. 검색 키워드 (카드 카드 스타일) */}
      <section id="booking" style={{ padding: "60px 40px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ color: "#FFF", fontSize: "1.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            상영중인 영화 검색
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: "24px" }}>
          {/* 카드 1: 영화 선택 */}
          <div
            style={{
              backgroundColor: "#18181c",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          ></div></div>
      </section>

      {/* 3. 빠른 예매 섹션 (카드 카드 스타일) */}
      <section id="booking" style={{ padding: "60px 40px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ color: "#FFF", fontSize: "1.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            빠른 예매
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: "24px" }}>
          {/* 카드 1: 영화 선택 */}
          <div
            style={{
              backgroundColor: "#18181c",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: "18px" }}>🎬 1. 영화 선택</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {TOP_MOVIES.map((movie) => {
                const isSelected = selectedMovie.id === movie.id;
                return (
                  <button
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setSelectedSeats([]);
                    }}
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "rgba(229, 9, 20, 0.15)" : "#222228",
                      color: isSelected ? "#ff4d4d" : "#ccc",
                      border: isSelected ? "1px solid #e50914" : "1px solid transparent",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: isSelected ? "bold" : "normal",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {movie.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 카드 2: 시간 선택 */}
          <div
            style={{
              backgroundColor: "#18181c",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: "18px" }}>⏰ 2. 시간 선택</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {TIME_SLOTS.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setSelectedSeats([]);
                    }}
                    style={{
                      padding: "14px",
                      backgroundColor: isSelected ? "#e50914" : "#222228",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      boxShadow: isSelected ? "0 4px 12px rgba(229, 9, 20, 0.4)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 카드 3: 좌석 선택 & 결제 */}
          <div
            style={{
              backgroundColor: "#18181c",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: "18px" }}>💺 3. 좌석 선택</h3>

              <div
                style={{
                  width: "100%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                  borderTop: "2px solid #fff",
                  textAlign: "center",
                  padding: "6px",
                  marginBottom: "25px",
                  fontSize: "0.75rem",
                  letterSpacing: "4px",
                  color: "#aaa",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                SCREEN
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                {ROWS.map((row) => (
                  <div key={row} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ width: "20px", color: "#666", fontSize: "0.85rem", fontWeight: "bold" }}>{row}</span>
                    {Array.from({ length: 8 }).map((_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const isSelected = selectedSeats.includes(seatId);
                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: isSelected ? "#e50914" : "#2a2a32",
                            color: isSelected ? "#fff" : "#888",
                            border: isSelected ? "1px solid #ff4d4d" : "1px solid #3a3a42",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 요금 및 결제 버튼 카트 */}
            <div
              style={{
                marginTop: "25px",
                padding: "16px 20px",
                backgroundColor: "#222228",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #2e2e36",
              }}
            >
              <div>
                <div style={{ fontSize: "0.9rem", color: "#aaa" }}>
                  {selectedMovie.title} <span style={{ color: "#e50914" }}>({selectedTime})</span>
                </div>
                <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem", marginTop: "2px" }}>
                  {(selectedSeats.length * PRICE_PER_SEAT).toLocaleString()} 원
                </div>
              </div>
              <button
                onClick={() => alert("예매가 완료되었습니다!")}
                disabled={selectedSeats.length === 0}
                style={{
                  backgroundColor: selectedSeats.length > 0 ? "#e50914" : "#444",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  boxShadow: selectedSeats.length > 0 ? "0 4px 15px rgba(229, 9, 20, 0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                예매하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 약도 안내 섹션 (카드 스타일) */}
      <section id="location" style={{ padding: "0 40px 60px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ color: "#FFF", fontSize: "1.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            📍 오시는 길
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
          {/* 약도 그래픽 카드 */}
          <div
            style={{
              backgroundColor: "#18181c",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            <svg viewBox="0 0 600 300" style={{ width: "100%", height: "auto", borderRadius: "12px" }}>
              <rect x="0" y="0" width="600" height="300" fill="#22252c" />
              <rect x="0" y="120" width="600" height="60" fill="#2d323b" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#4f5666" strokeWidth="2" strokeDasharray="10 10" />

              <rect x="260" y="0" width="60" height="300" fill="#2d323b" />
              <line x1="290" y1="0" x2="290" y2="300" stroke="#4f5666" strokeWidth="2" strokeDasharray="10 10" />

              <rect x="160" y="190" width="80" height="50" rx="8" fill="#2e7d32" />
              <text x="200" y="220" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">강남역 10번출구</text>

              <rect x="340" y="40" width="100" height="60" rx="8" fill="#3a3d45" />
              <text x="390" y="75" fill="#888" fontSize="12" textAnchor="middle">시티빌딩</text>

              <rect x="340" y="190" width="120" height="70" rx="10" fill="#e50914" stroke="#ff4d4d" strokeWidth="2" />
              <text x="400" y="225" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold">🎬 MOVIE CINEMA</text>
              <text x="400" y="245" fill="#ffcdd2" fontSize="10" textAnchor="middle">본관 5층</text>

              <circle cx="400" cy="175" r="10" fill="#e50914" />
              <circle cx="400" cy="175" r="4" fill="#fff" />
            </svg>
          </div>

          {/* 안내 정보 카드 */}
          <div
            style={{
              backgroundColor: "#18181c",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #2a2a30",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "1.3rem" }}>강남 MOVIE CINEMA</h3>
            <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "20px" }}>
              서울특별시 강남구 테헤란로 123 MOVIE 타워 5층
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #2a2a30", paddingTop: "20px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ backgroundColor: "rgba(76, 175, 80, 0.15)", color: "#4caf50", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>지하철</span>
                <span style={{ color: "#ccc", fontSize: "0.9rem" }}>2호선 강남역 10번 출구 (도보 3분)</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ backgroundColor: "rgba(33, 150, 243, 0.15)", color: "#2196f3", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>버스</span>
                <span style={{ color: "#ccc", fontSize: "0.9rem" }}>강남역 중앙차로 정류장 하차</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ backgroundColor: "rgba(255, 152, 0, 0.15)", color: "#ff9800", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>주차</span>
                <span style={{ color: "#ccc", fontSize: "0.9rem" }}>영화 관람 시 3시간 무료 주차 지원</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}