"use client";

import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import {
  CINEMAS,
  CINEMA_LOCATIONS,
  TIME_SLOTS,
  ROWS,
} from "@/hardCordingData/Movieinfo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Footer from "@/components/Footer";

// TMDB API 설정
const TMDB_KEY = "56fb86dc71df6fd10f48f977e78a5720";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
const NO_IMAGE_URL = "https://via.placeholder.com/500x750?text=No+Image";

// 단가 설정
const PRICE_ADULT = 15000;
const PRICE_YOUTH = 11000;

interface MovieType {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
}

export default function MainPage() {
  // TMDB API State
  const [topMovies, setTopMovies] = useState<MovieType[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MovieType[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MovieType[]>([]);

  // UI State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCinema, setSelectedCinema] = useState("CGV");
  const [selectedProvince, setSelectedProvince] = useState("경기/인천");
  const [selectedDistrict, setSelectedDistrict] = useState("안산시 단원구");
  
  // 선택된 영화 State
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // 성인 / 청소년 인원 상태
  const [adultCount, setAdultCount] = useState<number>(1);
  const [youthCount, setYouthCount] = useState<number>(0);

  // 총 관람 인원 및 금액 계산
  const totalPeople = adultCount + youthCount;
  const totalPrice = adultCount * PRICE_ADULT + youthCount * PRICE_YOUTH;

  // TMDB API 데이터 패치
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // 1. TOP 배너 및 현재 상영작 (Popular Movie API 사용)
        const popularRes = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=ko-KR&page=1`
        );
        const popularData = await popularRes.json();
        const popularList = popularData.results || [];

        // 2. 개봉 예정작 (Upcoming Movie API 사용)
        const upcomingRes = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=ko-KR&page=1`
        );
        const upcomingData = await upcomingRes.json();
        const upcomingList = upcomingData.results || [];

        setTopMovies(popularList.slice(0, 5)); // 상단 슬라이드 배너 5개
        setNowPlayingMovies(popularList);
        setUpcomingMovies(upcomingList);

        // 초기 선택 영화를 첫 번째 인기 영화로 설정
        if (popularList.length > 0) {
          setSelectedMovie(popularList[0]);
        }
      } catch (error) {
        console.error("영화 데이터를 가져오는 중 에러 발생:", error);
      }
    };

    fetchMovieData();
  }, []);

  // 배너 자동 타이머 (TOP 영화 데이터가 있을 때 작동)
  useEffect(() => {
    if (topMovies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topMovies.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [topMovies]);

  // 예매 관련 핸들러들
  const handleCinemaChange = (cinema: string) => {
    setSelectedCinema(cinema);
    setSelectedSeats([]);

    const cinemaData = CINEMA_LOCATIONS[cinema] || {};
    const availableProvinces = Object.keys(cinemaData);

    if (availableProvinces.length > 0) {
      const defaultProvince = availableProvinces.includes("경기/인천")
        ? "경기/인천"
        : availableProvinces[0];

      setSelectedProvince(defaultProvince);

      const districts = cinemaData[defaultProvince] || [];
      setSelectedDistrict(districts.length > 0 ? districts[0] : "");
    } else {
      setSelectedProvince("");
      setSelectedDistrict("");
    }
  };

  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedSeats([]);

    const districts = CINEMA_LOCATIONS[selectedCinema]?.[prov] || [];
    setSelectedDistrict(districts.length > 0 ? districts[0] : "");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedSeats([]);
  };

  const handleAdultChange = (delta: number) => {
    const next = adultCount + delta;
    if (next < 0) return;
    if (next + youthCount === 0) return;
    setAdultCount(next);
    setSelectedSeats([]);
  };

  const handleYouthChange = (delta: number) => {
    const next = youthCount + delta;
    if (next < 0) return;
    if (adultCount + next === 0) return;
    setYouthCount(next);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        if (prev.length >= totalPeople) {
          alert(`선택한 관람 인원(${totalPeople}명)을 초과하여 좌석을 선택할 수 없습니다.`);
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const currentCinemaData = CINEMA_LOCATIONS[selectedCinema] || {};
  const currentProvinces = Object.keys(currentCinemaData);
  const currentDistricts = currentCinemaData[selectedProvince] || [];

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
        {/* 1. 메인 배너 Carousel (TMDB Top Movies) */}
        <section
          style={{
            padding: "30px 40px 0",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "460px",
              overflow: "hidden",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            {topMovies.map((movie, index) => (
              <div
                key={movie.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: movie.backdrop_path
                    ? `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(18, 18, 18, 0.4) 60%, rgba(18, 18, 18, 0.9) 100%), url(${BACKDROP_BASE_URL}${movie.backdrop_path})`
                    : "linear-gradient(135deg, rgba(229, 9, 20, 0.4) 0%, rgba(18, 18, 18, 0.95) 70%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 50px",
                  opacity: currentSlide === index ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                  pointerEvents: currentSlide === index ? "auto" : "none",
                }}
              >
                {/* [맨 왼쪽 위] TOP 순위 표시 */}
                <span
                  style={{
                    position: "absolute",
                    top: "35px",
                    left: "50px",
                    backgroundColor: "rgba(229, 9, 20, 0.85)",
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    letterSpacing: "0.5px",
                    boxShadow: "0 4px 12px rgba(229, 9, 20, 0.4)",
                  }}
                >
                  🔥 TOP {index + 1} MOVIE
                </span>

                {/* [중앙 좌측] 영화 제목 및 설명 */}
                <div style={{ marginTop: "30px", maxWidth: "650px" }}>
                  <h1
                    style={{
                      fontSize: "3rem",
                      fontWeight: "800",
                      marginBottom: "20px",
                      lineHeight: "1.2",
                      textShadow: "0 4px 15px rgba(0,0,0,0.7)",
                    }}
                  >
                    {movie.title}
                  </h1>

                  <p
                    style={{
                      color: "#e0e0e0",
                      fontSize: "1rem",
                      lineHeight: "1.7",
                      marginBottom: "20px",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                    }}
                  >
                    {movie.overview || "등록된 상세 줄거리가 없습니다."}
                  </p>
                </div>

                {/* [왼쪽 맨 아래] 평점 정보 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "35px",
                    left: "50px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", color: "#ffcc00" }}>⭐</span>
                  <span style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#fff" }}>
                    {movie.vote_average?.toFixed(1) || "0.0"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#aaa" }}>/ 10</span>
                </div>
              </div>
            ))}

            {/* 인디케이터 (오른쪽 하단) */}
            <div style={{ position: "absolute", bottom: "35px", right: "50px", display: "flex", gap: "10px" }}>
              {topMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: currentSlide === index ? "32px" : "10px",
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

        {/* 2. 빠른 예매 */}
        <section
          id="booking"
          style={{
            padding: "60px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "25px" }}>
            <h2
              style={{
                color: "#FFF",
                fontSize: "1.8rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "24px",
                  backgroundColor: "#e50914",
                  borderRadius: "2px",
                }}
              ></span>
              빠른 예매
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 1.3fr",
              gap: "16px",
            }}
          >
            {/* 브랜드 및 지역 선택 */}
            <div
              style={{
                backgroundColor: "#18181c",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #2a2a30",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <h3 style={{ fontSize: "0.95rem", color: "#aaa", marginBottom: "10px" }}>
                  🍿 1. 영화관 브랜드
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {CINEMAS.map((cinema) => {
                    const isSelected = selectedCinema === cinema;
                    return (
                      <Button
                        key={cinema}
                        title={cinema}
                        isSelected={isSelected}
                        onClick={() => handleCinemaChange(cinema)}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: "0.95rem", color: "#aaa", marginBottom: "10px" }}>
                  📍 2. 지역 선택
                </h3>
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  {currentProvinces.map((prov) => {
                    const isSelected = selectedProvince === prov;
                    return (
                      <Button
                        key={prov}
                        title={prov}
                        isSelected={isSelected}
                        onClick={() => handleProvinceChange(prov)}
                      />
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    maxHeight: "180px",
                    overflowY: "auto",
                  }}
                >
                  {currentDistricts.map((district) => {
                    const isSelected = selectedDistrict === district;
                    return (
                      <Button
                        key={district}
                        title={district}
                        isSelected={isSelected}
                        onClick={() => handleDistrictChange(district)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 영화 선택 */}
            <div
              style={{
                backgroundColor: "#18181c",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #2a2a30",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", color: "#aaa", marginBottom: "14px" }}>
                🎬 3. 영화 선택
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "360px",
                  overflowY: "auto",
                }}
              >
                {nowPlayingMovies.map((movie) => {
                  const isSelected = selectedMovie?.id === movie.id;
                  return (
                    <Button
                      key={movie.id}
                      title={movie.title}
                      isSelected={isSelected}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setSelectedSeats([]);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 시간 & 인원 선택 */}
            <div
              style={{
                backgroundColor: "#18181c",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #2a2a30",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", color: "#aaa", marginBottom: "14px" }}>
                ⏰ 4. 시간 선택
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "20px" }}>
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      title={time}
                      isSelected={isSelected}
                      onClick={() => {
                        setSelectedTime(time);
                        setSelectedSeats([]);
                      }}
                    />
                  );
                })}
              </div>

              <h3 style={{ fontSize: "0.95rem", color: "#aaa", marginBottom: "14px" }}>
                👥 5. 인원수
              </h3>
              <div
                style={{
                  backgroundColor: "#222228",
                  padding: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#ccc" }}>성인 (15,000원)</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Button title="-" isSelected={false} onClick={() => handleAdultChange(-1)} />
                    <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{adultCount}</span>
                    <Button title="+" isSelected={false} onClick={() => handleAdultChange(1)} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#ccc" }}>청소년 (11,000원)</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Button title="-" isSelected={false} onClick={() => handleYouthChange(-1)} />
                    <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{youthCount}</span>
                    <Button title="+" isSelected={false} onClick={() => handleYouthChange(1)} />
                  </div>
                </div>
              </div>
            </div>

            {/* 좌석 선택 및 예매 */}
            <div
              style={{
                backgroundColor: "#18181c",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #2a2a30",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ fontSize: "0.95rem", color: "#aaa", marginBottom: "14px" }}>
                  💺 6. 좌석 선택
                </h3>

                <div
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                    borderTop: "2px solid #fff",
                    textAlign: "center",
                    padding: "4px",
                    marginBottom: "20px",
                    fontSize: "0.7rem",
                    letterSpacing: "4px",
                    color: "#aaa",
                  }}
                >
                  SCREEN
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {ROWS.map((row) => (
                    <div key={row} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ width: "16px", color: "#666", fontSize: "0.75rem", fontWeight: "bold" }}>
                        {row}
                      </span>
                      {Array.from({ length: 8 }).map((_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <Button
                            key={seatId}
                            title={String(i + 1)}
                            isSelected={isSelected}
                            onClick={() => toggleSeat(seatId)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "14px",
                  backgroundColor: "#222228",
                  borderRadius: "10px",
                  border: "1px solid #2e2e36",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#ff4d4d", fontWeight: "bold" }}>
                  [{selectedCinema}] {selectedDistrict}
                </div>

                <div style={{ fontSize: "0.85rem", color: "#fff", margin: "2px 0" }}>
                  {selectedMovie?.title} ({selectedTime})
                </div>

                <div style={{ fontSize: "0.75rem", color: "#aaa" }}>
                  인원: 성인 {adultCount}명, 청소년 {youthCount}명 (총 {totalPeople}명)
                </div>

                <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "2px" }}>
                  선택 좌석: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "미선택"} ({selectedSeats.length}/{totalPeople})
                </div>

                <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem", margin: "6px 0 10px" }}>
                  {totalPrice.toLocaleString()} 원
                </div>

                <div style={{ display: "flex", width: "100%" }}>
                  <Button
                    title="예매하기"
                    isSelected={selectedSeats.length === totalPeople}
                    width="100%"
                    onClick={() => {
                      if (selectedSeats.length !== totalPeople) {
                        alert(`관람 인원수(${totalPeople}명)에 맞게 좌석을 선택해주세요.`);
                        return;
                      }

                      alert(
                        `[${selectedCinema} ${selectedDistrict}]\n영화: ${selectedMovie?.title}\n시간: ${selectedTime}\n인원: 성인 ${adultCount}명, 청소년 ${youthCount}명\n좌석: ${selectedSeats.join(
                          ", "
                        )}\n총 결제금액: ${totalPrice.toLocaleString()}원\n\n예매가 완료되었습니다!`
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 현재 상영작 */}
        <section style={{ padding: "0 40px 60px", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "25px" }}>
            <h2
              style={{
                color: "#FFF",
                fontSize: "1.8rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "24px",
                  backgroundColor: "#e50914",
                  borderRadius: "2px",
                }}
              ></span>
              현재 상영작
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {nowPlayingMovies.map((movie) => (
              <Card
                key={movie.id}
                image={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : NO_IMAGE_URL}
                title={movie.title}
                genre={`평점 ⭐ ${movie.vote_average?.toFixed(1) || "0.0"}`}
                BT={
                  <Button
                    title="바로 예매"
                    width="100%"
                    isSelected={true}
                    onClick={() => {
                      setSelectedMovie(movie);
                      const bookingSection = document.getElementById("booking");
                      bookingSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                }
              />
            ))}
          </div>
        </section>

        {/* 4. 개봉 예정작 */}
        <section style={{ padding: "0 40px 60px", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "25px" }}>
            <h2
              style={{
                color: "#FFF",
                fontSize: "1.8rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "24px",
                  backgroundColor: "#e50914",
                  borderRadius: "2px",
                }}
              ></span>
              개봉 예정작
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {upcomingMovies.map((movie) => (
              <Card
                key={movie.id}
                image={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : NO_IMAGE_URL}
                title={movie.title}
                genre={`개봉일: ${movie.release_date || "미정"}`}
                BT={
                  <Button
                    width="100%"
                    title="🔔 개봉 알림 받기"
                    isSelected={false}
                    onClick={() => alert(`${movie.title} 알림 신청이 완료되었습니다.`)}
                  />
                }
              />
            ))}
          </div>
        </section>

        {/* 5. 하단 푸터 */}
        <Footer />
      </div>
    </>
  );
}