"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";

// ===== 데이터 타입 정의 =====
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "회원" | "VIP" | "관리자";
  points: number;
  status: "활성" | "정지";
  joinedAt: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  runtime: number; // 분 단위
  rating: string; // 관람 등급
  status: "상영중" | "개봉예정" | "상영종료";
}

interface Schedule {
  id: number;
  movieTitle: string;
  cinemaBrand: string; // CGV, Lotte Cinema 등
  district: string;
  screenHall: string; // 1관, IMAX관 등
  startTime: string;
  endTime: string;
  priceAdult: number;
  priceYouth: number;
}

interface Reservation {
  id: string;
  userName: string;
  userPhone: string;
  movieTitle: string;
  cinemaInfo: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "결제완료" | "취소완료";
  createdAt: string;
}

interface Coupon {
  id: number;
  code: string;
  name: string;
  discount: number; // 금액 할인 (원)
  expiryDate: string;
  usageCount: number;
}

export default function DetailedAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "movies" | "schedules" | "reservations" | "coupons"
  >("dashboard");

  // ===== 가상 초기 데이터 =====
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      role: "VIP",
      points: 15000,
      status: "활성",
      joinedAt: "2026-01-15",
    },
    {
      id: 2,
      name: "김영희",
      email: "kim@example.com",
      phone: "010-9876-5432",
      role: "회원",
      points: 2500,
      status: "활성",
      joinedAt: "2026-03-20",
    },
    {
      id: 3,
      name: "이철수",
      email: "lee@example.com",
      phone: "010-5555-4444",
      role: "회원",
      points: 0,
      status: "정지",
      joinedAt: "2026-05-10",
    },
  ]);

  const [movies, setMovies] = useState<Movie[]>([
    { id: 1, title: "오디세이", genre: "SF / 액션", runtime: 150, rating: "12세 이상", status: "상영중" },
    { id: 2, title: "아바타 3", genre: "SF / 어드벤처", runtime: 180, rating: "12세 이상", status: "개봉예정" },
    { id: 3, title: "파묘", genre: "미스터리", runtime: 134, rating: "15세 이상", status: "상영종료" },
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 101,
      movieTitle: "오디세이",
      cinemaBrand: "CGV",
      district: "안산시 단원구",
      screenHall: "1관 (Laser)",
      startTime: "10:00",
      endTime: "12:30",
      priceAdult: 15000,
      priceYouth: 11000,
    },
    {
      id: 102,
      movieTitle: "오디세이",
      cinemaBrand: "CGV",
      district: "안산시 단원구",
      screenHall: "2관 (IMAX)",
      startTime: "14:00",
      endTime: "16:30",
      priceAdult: 18000,
      priceYouth: 14000,
    },
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "RES-20260826-001",
      userName: "홍길동",
      userPhone: "010-1234-5678",
      movieTitle: "오디세이",
      cinemaInfo: "CGV 안산시 단원구 1관",
      seats: ["A1", "A2"],
      totalAmount: 30000,
      paymentMethod: "신용카드",
      paymentStatus: "결제완료",
      createdAt: "2026-08-26 10:30",
    },
    {
      id: "RES-20260826-002",
      userName: "김영희",
      userPhone: "010-9876-5432",
      movieTitle: "오디세이",
      cinemaInfo: "CGV 안산시 단원구 2관",
      seats: ["C5"],
      totalAmount: 18000,
      paymentMethod: "카카오페이",
      paymentStatus: "결제완료",
      createdAt: "2026-08-26 11:15",
    },
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 1, code: "WELCOME2026", name: "신규 가입 3,000원 할인쿠폰", discount: 3000, expiryDate: "2026-12-31", usageCount: 142 },
    { id: 2, code: "SUMMERMOVIE", name: "여름 스페셜 5,000원 할인쿠폰", discount: 5000, expiryDate: "2026-08-31", usageCount: 89 },
  ]);

  // ===== 폼 State (입력용) =====
  // 영화 폼
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newRuntime, setNewRuntime] = useState<number | "">("");
  const [newRating, setNewRating] = useState("전체 관람가");
  const [newMovieStatus, setNewMovieStatus] = useState<"상영중" | "개봉예정">("개봉예정");

  // 스케줄 폼
  const [selectedMovieForSched, setSelectedMovieForSched] = useState("");
  const [schedCinema, setSchedCinema] = useState("CGV");
  const [schedDistrict, setSchedDistrict] = useState("안산시 단원구");
  const [schedHall, setSchedHall] = useState("1관");
  const [schedTime, setSchedTime] = useState("10:00");

  // 쿠폰 폼
  const [couponCode, setCouponCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number | "">("");
  const [couponExpiry, setCouponExpiry] = useState("");

  // ===== 핸들러 함수들 =====
  // 유저 상태 변경 (활성/정지)
  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "활성" ? "정지" : "활성" }
          : u
      )
    );
  };

  // 영화 추가
  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieTitle || !newGenre || !newRuntime) {
      alert("모든 필수 영화 정보를 입력해주세요.");
      return;
    }
    const newMovie: Movie = {
      id: Date.now(),
      title: newMovieTitle,
      genre: newGenre,
      runtime: Number(newRuntime),
      rating: newRating,
      status: newMovieStatus,
    };
    setMovies([...movies, newMovie]);
    setNewMovieTitle("");
    setNewGenre("");
    setNewRuntime("");
    alert("신규 영화가 성공적으로 등록되었습니다.");
  };

  // 스케줄 추가
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovieForSched) {
      alert("상영할 영화를 선택해주세요.");
      return;
    }
    const newSched: Schedule = {
      id: Date.now(),
      movieTitle: selectedMovieForSched,
      cinemaBrand: schedCinema,
      district: schedDistrict,
      screenHall: schedHall,
      startTime: schedTime,
      endTime: "종료시간 계산됨",
      priceAdult: 15000,
      priceYouth: 11000,
    };
    setSchedules([...schedules, newSched]);
    alert("상영 스케줄이 추가되었습니다.");
  };

  // 쿠폰 생성
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponName || !couponDiscount || !couponExpiry) {
      alert("쿠폰 정보를 모두 입력해주세요.");
      return;
    }
    const newCp: Coupon = {
      id: Date.now(),
      code: couponCode.toUpperCase(),
      name: couponName,
      discount: Number(couponDiscount),
      expiryDate: couponExpiry,
      usageCount: 0,
    };
    setCoupons([...coupons, newCp]);
    setCouponCode("");
    setCouponName("");
    setCouponDiscount("");
    setCouponExpiry("");
    alert("할인 쿠폰이 발행되었습니다.");
  };

  // 예매 강제 취소
  const handleCancelReservation = (resId: string) => {
    if (confirm(`예매 [${resId}] 건을 강제 취소/환불 처리하시겠습니까?`)) {
      setReservations(
        reservations.map((r) =>
          r.id === resId ? { ...r, paymentStatus: "취소완료" } : r
        )
      );
    }
  };

  return (
    <>
      <Menu />

      <div style={containerStyle}>
        <div style={innerContainerStyle}>
          {/* 대시보드 타이틀 */}
          <div style={headerStyle}>
            <div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: "800" }}>
                ⚙️ 영화관 통합 관리자 시스템
              </h1>
              <p style={{ color: "#aaa", marginTop: "6px", fontSize: "0.95rem" }}>
                유저 관리, 영화/스케줄 등록, 예매 내역 및 쿠폰 발행을 한곳에서 관리합니다.
              </p>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div style={tabContainerStyle}>
            <Button
              title="📊 종합 대시보드"
              isSelected={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <Button
              title="👥 유저(회원) 관리"
              isSelected={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
            <Button
              title="🎬 영화 등록/관리"
              isSelected={activeTab === "movies"}
              onClick={() => setActiveTab("movies")}
            />
            <Button
              title="🗓️ 상영 스케줄"
              isSelected={activeTab === "schedules"}
              onClick={() => setActiveTab("schedules")}
            />
            <Button
              title="🎟️ 예매/결제 내역"
              isSelected={activeTab === "reservations"}
              onClick={() => setActiveTab("reservations")}
            />
            <Button
              title="🎁 쿠폰/이벤트"
              isSelected={activeTab === "coupons"}
              onClick={() => setActiveTab("coupons")}
            />
          </div>

          {/* 1. 종합 대시보드 */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={grid4Style}>
                <div style={cardStyle}>
                  <span style={cardLabelStyle}>💰 누적 총 매출액</span>
                  <span style={cardValueStyle}>42,850,000 원</span>
                  <span style={cardSubStyle}>전월 대비 +14.2% ↑</span>
                </div>
                <div style={cardStyle}>
                  <span style={cardLabelStyle}>🎟️ 금일 예매 건수</span>
                  <span style={cardValueStyle}>{reservations.length} 건</span>
                  <span style={cardSubStyle}>목표 달성률 85%</span>
                </div>
                <div style={cardStyle}>
                  <span style={cardLabelStyle}>👥 총 등록 회원</span>
                  <span style={cardValueStyle}>{users.length} 명</span>
                  <span style={cardSubStyle}>VIP 비율 33.3%</span>
                </div>
                <div style={cardStyle}>
                  <span style={cardLabelStyle}>🍿 현재 상영작</span>
                  <span style={cardValueStyle}>
                    {movies.filter((m) => m.status === "상영중").length} 개
                  </span>
                  <span style={cardSubStyle}>개봉 예정작 1개</span>
                </div>
              </div>

              {/* 최근 예매 현황 요약 */}
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>⚡ 실시간 예매 현황 요약</h2>
                <table style={tableStyle}>
                  <thead>
                    <tr style={thRowStyle}>
                      <th style={thTdStyle}>예매번호</th>
                      <th style={thTdStyle}>고객명</th>
                      <th style={thTdStyle}>영화명</th>
                      <th style={thTdStyle}>결제금액</th>
                      <th style={thTdStyle}>결제상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid #2a2a30" }}>
                        <td style={thTdStyle}>{r.id}</td>
                        <td style={thTdStyle}>{r.userName} ({r.userPhone})</td>
                        <td style={{ ...thTdStyle, fontWeight: "bold" }}>{r.movieTitle}</td>
                        <td style={{ ...thTdStyle, color: "#ffcc00" }}>{r.totalAmount.toLocaleString()}원</td>
                        <td style={thTdStyle}>
                          <span
                            style={{
                              color: r.paymentStatus === "결제완료" ? "#4caf50" : "#ff4d4d",
                              fontWeight: "bold",
                            }}
                          >
                            {r.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. 유저 관리 */}
          {activeTab === "users" && (
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>👥 회원 목록 및 상태 관리 ({users.length}명)</h2>
              <table style={tableStyle}>
                <thead>
                  <tr style={thRowStyle}>
                    <th style={thTdStyle}>ID</th>
                    <th style={thTdStyle}>이름</th>
                    <th style={thTdStyle}>이메일</th>
                    <th style={thTdStyle}>연락처</th>
                    <th style={thTdStyle}>등급</th>
                    <th style={thTdStyle}>포인트</th>
                    <th style={thTdStyle}>가입일</th>
                    <th style={thTdStyle}>계정상태</th>
                    <th style={thTdStyle}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #2a2a30" }}>
                      <td style={thTdStyle}>{u.id}</td>
                      <td style={{ ...thTdStyle, fontWeight: "bold" }}>{u.name}</td>
                      <td style={thTdStyle}>{u.email}</td>
                      <td style={thTdStyle}>{u.phone}</td>
                      <td style={thTdStyle}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: u.role === "VIP" ? "#ff9800" : "#3a3a42",
                            fontSize: "0.8rem",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...thTdStyle, color: "#ffcc00" }}>{u.points.toLocaleString()} P</td>
                      <td style={thTdStyle}>{u.joinedAt}</td>
                      <td style={thTdStyle}>
                        <span style={{ color: u.status === "활성" ? "#4caf50" : "#ff4d4d" }}>
                          ● {u.status}
                        </span>
                      </td>
                      <td style={thTdStyle}>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          style={{
                            backgroundColor: u.status === "활성" ? "#e50914" : "#4caf50",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          {u.status === "활성" ? "계정 정지" : "정지 해제"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. 영화 관리 */}
          {activeTab === "movies" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* 영화 신규 등록 폼 */}
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>➕ 신규 영화 등록</h2>
                <form
                  onSubmit={handleAddMovie}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="영화 제목"
                    value={newMovieTitle}
                    onChange={(e) => setNewMovieTitle(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="장르 (예: SF/액션)"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="러닝타임(분)"
                    value={newRuntime}
                    onChange={(e) => setNewRuntime(Number(e.target.value))}
                    style={inputStyle}
                  />
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="전체 관람가">전체 관람가</option>
                    <option value="12세 이상">12세 이상</option>
                    <option value="15세 이상">15세 이상</option>
                    <option value="청소년 관람불가">청소년 관람불가</option>
                  </select>
                  <select
                    value={newMovieStatus}
                    onChange={(e) =>
                      setNewMovieStatus(e.target.value as "상영중" | "개봉예정")
                    }
                    style={inputStyle}
                  >
                    <option value="개봉예정">개봉예정</option>
                    <option value="상영중">상영중</option>
                  </select>
                  <Button title="영화 등록" isSelected={true} width="100%" onClick={() => {}} />
                </form>
              </div>

              {/* 영화 목록 테이블 */}
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🎬 등록된 영화 목록 ({movies.length})</h2>
                <table style={tableStyle}>
                  <thead>
                    <tr style={thRowStyle}>
                      <th style={thTdStyle}>ID</th>
                      <th style={thTdStyle}>제목</th>
                      <th style={thTdStyle}>장르</th>
                      <th style={thTdStyle}>러닝타임</th>
                      <th style={thTdStyle}>관람등급</th>
                      <th style={thTdStyle}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((m) => (
                      <tr key={m.id} style={{ borderBottom: "1px solid #2a2a30" }}>
                        <td style={thTdStyle}>{m.id}</td>
                        <td style={{ ...thTdStyle, fontWeight: "bold" }}>{m.title}</td>
                        <td style={thTdStyle}>{m.genre}</td>
                        <td style={thTdStyle}>{m.runtime} 분</td>
                        <td style={thTdStyle}>{m.rating}</td>
                        <td style={thTdStyle}>
                          <select
                            value={m.status}
                            onChange={(e) => {
                              const status = e.target.value as "상영중" | "개봉예정" | "상영종료";
                              setMovies(
                                movies.map((item) =>
                                  item.id === m.id ? { ...item, status } : item
                                )
                              );
                            }}
                            style={{
                              ...inputStyle,
                              padding: "4px 8px",
                              backgroundColor:
                                m.status === "상영중" ? "#1e3a29" : "#2a2a30",
                              color: m.status === "상영중" ? "#4caf50" : "#ff9800",
                            }}
                          >
                            <option value="상영중">상영중</option>
                            <option value="개봉예정">개봉예정</option>
                            <option value="상영종료">상영종료</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. 상영 스케줄 관리 */}
          {activeTab === "schedules" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🗓️ 상영 시간표 추가</h2>
                <form
                  onSubmit={handleAddSchedule}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <select
                    value={selectedMovieForSched}
                    onChange={(e) => setSelectedMovieForSched(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">영화 선택</option>
                    {movies
                      .filter((m) => m.status === "상영중")
                      .map((m) => (
                        <option key={m.id} value={m.title}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                  <select
                    value={schedCinema}
                    onChange={(e) => setSchedCinema(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="CGV">CGV</option>
                    <option value="LOTTE CINEMA">LOTTE CINEMA</option>
                    <option value="MEGABOX">MEGABOX</option>
                  </select>
                  <input
                    type="text"
                    placeholder="지역 (예: 안산시 단원구)"
                    value={schedDistrict}
                    onChange={(e) => setSchedDistrict(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="상영관 (예: 1관 IMAX)"
                    value={schedHall}
                    onChange={(e) => setSchedHall(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="time"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    style={inputStyle}
                  />
                  <Button title="스케줄 등록" isSelected={true} width="100%" onClick={() => {}} />
                </form>
              </div>

              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🕒 등록된 상영 시간표 ({schedules.length})</h2>
                <table style={tableStyle}>
                  <thead>
                    <tr style={thRowStyle}>
                      <th style={thTdStyle}>ID</th>
                      <th style={thTdStyle}>영화명</th>
                      <th style={thTdStyle}>극장 브랜드</th>
                      <th style={thTdStyle}>지역</th>
                      <th style={thTdStyle}>상영관</th>
                      <th style={thTdStyle}>시작 시간</th>
                      <th style={thTdStyle}>성인 단가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((s) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid #2a2a30" }}>
                        <td style={thTdStyle}>{s.id}</td>
                        <td style={{ ...thTdStyle, fontWeight: "bold" }}>{s.movieTitle}</td>
                        <td style={thTdStyle}>{s.cinemaBrand}</td>
                        <td style={thTdStyle}>{s.district}</td>
                        <td style={thTdStyle}>{s.screenHall}</td>
                        <td style={{ ...thTdStyle, color: "#ffcc00" }}>{s.startTime}</td>
                        <td style={thTdStyle}>{s.priceAdult.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. 예매/결제 내역 관리 */}
          {activeTab === "reservations" && (
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>🎟️ 전체 예매 및 결제 내역</h2>
              <table style={tableStyle}>
                <thead>
                  <tr style={thRowStyle}>
                    <th style={thTdStyle}>예매번호</th>
                    <th style={thTdStyle}>예약자명</th>
                    <th style={thTdStyle}>영화명</th>
                    <th style={thTdStyle}>상영/좌석 정보</th>
                    <th style={thTdStyle}>결제 금액 / 수단</th>
                    <th style={thTdStyle}>결제 상태</th>
                    <th style={thTdStyle}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #2a2a30" }}>
                      <td style={{ ...thTdStyle, fontSize: "0.85rem", color: "#aaa" }}>{r.id}</td>
                      <td style={thTdStyle}>
                        {r.userName}
                        <br />
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>{r.userPhone}</span>
                      </td>
                      <td style={{ ...thTdStyle, fontWeight: "bold" }}>{r.movieTitle}</td>
                      <td style={thTdStyle}>
                        {r.cinemaInfo}
                        <br />
                        <span style={{ color: "#e50914", fontSize: "0.8rem" }}>
                          좌석: {r.seats.join(", ")}
                        </span>
                      </td>
                      <td style={thTdStyle}>
                        {r.totalAmount.toLocaleString()}원
                        <br />
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>{r.paymentMethod}</span>
                      </td>
                      <td style={thTdStyle}>
                        <span
                          style={{
                            color: r.paymentStatus === "결제완료" ? "#4caf50" : "#ff4d4d",
                            fontWeight: "bold",
                          }}
                        >
                          {r.paymentStatus}
                        </span>
                      </td>
                      <td style={thTdStyle}>
                        {r.paymentStatus === "결제완료" && (
                          <button
                            onClick={() => handleCancelReservation(r.id)}
                            style={{
                              backgroundColor: "#444",
                              color: "#fff",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            강제 환불
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. 쿠폰 및 이벤트 관리 */}
          {activeTab === "coupons" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🎁 신규 할인 쿠폰 생성</h2>
                <form
                  onSubmit={handleAddCoupon}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="쿠폰 코드 (예: MOVIE2026)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="쿠폰 이름"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="할인 금액(원)"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    style={inputStyle}
                  />
                  <input
                    type="date"
                    value={couponExpiry}
                    onChange={(e) => setCouponExpiry(e.target.value)}
                    style={inputStyle}
                  />
                  <Button title="쿠폰 발행" isSelected={true} width="100%" onClick={() => {}} />
                </form>
              </div>

              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>🏷️ 발행된 쿠폰 목록</h2>
                <table style={tableStyle}>
                  <thead>
                    <tr style={thRowStyle}>
                      <th style={thTdStyle}>ID</th>
                      <th style={thTdStyle}>쿠폰 코드</th>
                      <th style={thTdStyle}>쿠폰명</th>
                      <th style={thTdStyle}>할인 금액</th>
                      <th style={thTdStyle}>유효 기간</th>
                      <th style={thTdStyle}>사용 횟수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid #2a2a30" }}>
                        <td style={thTdStyle}>{c.id}</td>
                        <td style={{ ...thTdStyle, fontWeight: "bold", color: "#ffcc00" }}>{c.code}</td>
                        <td style={thTdStyle}>{c.name}</td>
                        <td style={thTdStyle}>{c.discount.toLocaleString()} 원</td>
                        <td style={thTdStyle}>{c.expiryDate} 까지</td>
                        <td style={thTdStyle}>{c.usageCount} 회</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

// ===== 인라인 스타일 모음 =====
const containerStyle: React.CSSProperties = {
  backgroundColor: "#0f0f12",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "sans-serif",
  paddingBottom: "80px",
};

const innerContainerStyle: React.CSSProperties = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "40px 20px 0",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "24px",
  borderBottom: "1px solid #2a2a30",
  paddingBottom: "16px",
};

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #2a2a30",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: "16px",
};

const grid4Style: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #2a2a30",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#aaa",
};

const cardValueStyle: React.CSSProperties = {
  fontSize: "1.6rem",
  fontWeight: "bold",
  color: "#fff",
};

const cardSubStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#4caf50",
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "#222228",
  border: "1px solid #3a3a42",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  outline: "none",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  fontSize: "0.85rem",
};

const thRowStyle: React.CSSProperties = {
  backgroundColor: "#222228",
  color: "#aaa",
};

const thTdStyle: React.CSSProperties = {
  padding: "12px 14px",
};