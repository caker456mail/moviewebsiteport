import { useState, useEffect } from "react";
import { CinemaNameItem } from "@/feature/CinemaName/Item";
import { events, EventItem } from "@/hardCordingData/Event";
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
  // 진행 중인 이벤트만 필터링 (isEnded === false)
  const activeEvents = events.filter((event) => !event.isEnded);

  // TMDB API State
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
        // 1. 현재 극장 상영작 (movie/now_playing 사용)
        // region=KR을 주면 한국 극장 실상영 데이터만 깔끔하게 나옵니다.
        const nowPlayingRes = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_KEY}&language=ko-KR&page=1&region=KR`
        );
        const nowPlayingData = await nowPlayingRes.json();
        const nowPlayingList = nowPlayingData.results || [];

        // 2. 극장 개봉 예정작 (movie/upcoming 사용)
        const upcomingRes = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=ko-KR&page=1&region=KR`
        );
        const upcomingData = await upcomingRes.json();
        const upcomingList = upcomingData.results || [];

        setNowPlayingMovies(nowPlayingList);
        setUpcomingMovies(upcomingList);

        if (nowPlayingList.length > 0) {
          setSelectedMovie(nowPlayingList[0]);
        }
      } catch (error) {
        console.error("영화 데이터를 가져오는 중 에러 발생:", error);
      }
    };

    fetchMovieData();
  }, []);

  // 배너 자동 타이머 (진행 중인 이벤트 데이터 기반 작동)
  useEffect(() => {
    if (activeEvents.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeEvents.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeEvents.length]);

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
        {/* 1. 메인 배너 Carousel (진행 중인 이벤트 바인딩) */}
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
            {activeEvents.map((event, index) => (
              <div
                key={event.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(18, 18, 18, 0.45) 60%, rgba(18, 18, 18, 0.9) 100%), url(${event.imageUrl})`,
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
                <div style={{ maxWidth: "680px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#e50914",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      marginBottom: "16px",
                    }}
                  >
                    🎉 {event.category}
                  </span>
                  <h1
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: "800",
                      marginBottom: "12px",
                      lineHeight: "1.3",
                      textShadow: "0 4px 15px rgba(0,0,0,0.7)",
                    }}
                  >
                    {event.title}
                  </h1>
                  <p
                    style={{
                      color: "#ddd",
                      fontSize: "1.05rem",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                    }}
                  >
                    {event.subtitle}
                  </p>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                    }}
                  >
                    📅 이벤트 기간: {event.period}
                  </p>
                </div>
              </div>
            ))}

            {/* 인디케이터 (오른쪽 하단) */}
            <div
              style={{
                position: "absolute",
                bottom: "35px",
                right: "50px",
                display: "flex",
                gap: "10px",
              }}
            >
              {activeEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: currentSlide === index ? "32px" : "10px",
                    height: "10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor:
                      currentSlide === index ? "#e50914" : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. 빠른 이동 */}
        <section
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
              빠른 이동
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {CinemaNameItem.map((item) => (
              <Card
                key={item.name}
                center={true}
                title={item.name}
                BT={
                  <Button
                    width="100%"
                    title="빠른이동"
                    isSelected={true}
                    onClick={() => {
                      window.location.href = item.href;
                    }}
                  />
                }
              />
            ))}
          </div>
        </section>

        {/* 3. 빠른 예매 */}
        <section
          id="booking"
          style={{
            padding: "0 40px 60px",
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
              빠른 예매 (개발 진행중)
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {CinemaNameItem.map((item) => {

                    // 현재 순회 중인 브랜드가 선택된 브랜드인지 확인
                    const isSelected = selectedCinema === item.name;
                    if (item.name !== "더보기") {
                      return (
                        <Button
                          key={item.name}
                          title={item.name}
                          isSelected={isSelected}
                          onClick={() => handleCinemaChange(item.name)}
                        />
                      );
                    }

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
                  maxHeight: "450px",
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

        {/* 4. 현재 상영작 */}
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

        {/* 5. 개봉 예정작 */}
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

        {/* 6. 하단 푸터 */}
        <Footer />
      </div>
    </>
  );
}