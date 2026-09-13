import { useState, useEffect, useMemo, useCallback } from "react";
import { events } from "@/hardCordingData/Event";
import { TIME_SLOTS, ROWS } from "@/hardCordingData/Movieinfo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/custom/Card";
import { CinemaName, CinemaItem } from "@/service/CinemaName";
import { CinemaLocation, CinemaLocation as CinemaLocationType } from "@/service/CinemaLocation";
import { CardForm, validateStepAvailability } from "@/components/custom/CardForm";
import { getFilterMainForm } from "@/feature/FilterConfig";
import { getMovies } from "@/service/MovieService";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const NO_IMAGE_URL = "https://via.placeholder.com/500x750?text=No+Image";

const PRICE_ADULT = 15000;
const PRICE_YOUTH = 11000;

interface MovieType {
  id: number;
  title: string;
  overview?: string;
  posterPath?: string;
  poster_path?: string;
  backdropPath?: string;
  backdrop_path?: string;
  voteAverage?: number;
  vote_average?: number;
  releaseDate?: string;
  release_date?: string;
  status?: string;
}

type LocationTree = Record<string, Record<string, string[]>>;

export default function MainPage() {
  const activeEvents = useMemo(() => events.filter((event) => !event.isEnded), []);

  const [nowPlayingMovies, setNowPlayingMovies] = useState<MovieType[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MovieType[]>([]);
  const [, setIsMovieLoading] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 단계별 선택 상태
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedGu, setSelectedGu] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [adultCount, setAdultCount] = useState<number>(0);
  const [youthCount, setYouthCount] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const totalPeople = adultCount + youthCount;
  const totalPrice = adultCount * PRICE_ADULT + youthCount * PRICE_YOUTH;

  const [cinemas, setCinemas] = useState<CinemaItem[]>([]);
  const [locationCinema, setLocationCinema] = useState<Record<string, CinemaLocationType[]>>({});
  const [, setLoading] = useState<boolean>(true);

  // 1. 영화 데이터 로드
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsMovieLoading(true);
        const data = await getMovies();

        const normalizedData: MovieType[] = data.map((item: any) => ({
          ...item,
          posterPath: item.posterPath || item.poster_path,
          backdropPath: item.backdropPath || item.backdrop_path,
          voteAverage: item.voteAverage ?? item.vote_average,
          releaseDate: item.releaseDate || item.release_date,
        }));
        setNowPlayingMovies(normalizedData);
        setUpcomingMovies(normalizedData);
      } catch (error) {
        console.error("영화 데이터를 가져오지 못했습니다:", error);
      } finally {
        setIsMovieLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // 2. 영화관 브랜드 목록 로드
  useEffect(() => {
    const loadCinemaData = async () => {
      try {
        setLoading(true);
        const data = await CinemaName();
        if (data) setCinemas(data);
      } catch (error) {
        console.error("영화관 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCinemaData();
  }, []);

  // 3. 브랜드별 위치 데이터 로드
  const fetchLocations = useCallback(
    async (cinemaName: string) => {
      if (!cinemaName || locationCinema[cinemaName]) return;

      try {
        const data = await CinemaLocation(cinemaName);
        if (data && Array.isArray(data)) {
          setLocationCinema((prev) => ({
            ...prev,
            [cinemaName]: data,
          }));
        }
      } catch (error) {
        console.error("영화관 위치 로드 실패:", error);
      }
    },
    [locationCinema]
  );

  useEffect(() => {
    if (selectedCinema) {
      fetchLocations(selectedCinema);
    }
  }, [selectedCinema, fetchLocations]);
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    // 도메인 출처 검증
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === "PAYMENT_SUCCESS") {
      alert(`결제가 완료되었습니다! (주문번호: ${event.data.orderId})`);
      
      // 결제 성공 후속 작업:
      // 예: 예매 완료 페이지 이동, 좌석 선택 초기화, 메인 새로고침 등
      window.location.href = "/profile"; // 예매 내역 확인 페이지 등으로 이동
    } else if (event.data?.type === "PAYMENT_FAIL") {
      alert(`결제 승인 실패: ${event.data.message}`);
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);
  // 4. 위치 데이터 계층 파싱
  const locationTree = useMemo<LocationTree>(() => {
    const rawList = locationCinema[selectedCinema] || [];
    const tree: LocationTree = {};

    rawList.forEach((item) => {
      if (!item.cinemaLocation) return;
      const parts = item.cinemaLocation.split(">").map((s) => s.trim());
      const city = parts[0];
      const gu = parts[1];
      const branch = parts[2];

      if (!city) return;
      if (!tree[city]) tree[city] = {};

      if (gu) {
        if (!tree[city][gu]) tree[city][gu] = [];
        if (branch && !tree[city][gu].includes(branch)) {
          tree[city][gu].push(branch);
        }
      }
    });

    return tree;
  }, [selectedCinema, locationCinema]);

  const cityList = useMemo(() => Object.keys(locationTree), [locationTree]);
  const guList = useMemo(() => {
    return selectedCity && locationTree[selectedCity] ? Object.keys(locationTree[selectedCity]) : [];
  }, [locationTree, selectedCity]);
  const branchList = useMemo(() => {
    return selectedCity && selectedGu && locationTree[selectedCity]?.[selectedGu]
      ? locationTree[selectedCity][selectedGu]
      : [];
  }, [locationTree, selectedCity, selectedGu]);

  // 배너 슬라이드 타이머
  useEffect(() => {
    if (activeEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeEvents.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeEvents.length]);

  // Cascade Reset 핸들러
  const handleCinemaChange = (cinema: string) => {
    setSelectedCinema(cinema);
    setSelectedCity("");
    setSelectedGu("");
    setSelectedBranch("");
    setSelectedMovie(null);
    setSelectedTime("");
    setAdultCount(0);
    setYouthCount(0);
    setSelectedSeats([]);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedGu("");
    setSelectedBranch("");
    setSelectedMovie(null);
    setSelectedTime("");
    setAdultCount(0);
    setYouthCount(0);
    setSelectedSeats([]);
  };

  const handleGuChange = (gu: string) => {
    setSelectedGu(gu);
    setSelectedBranch("");
    setSelectedMovie(null);
    setSelectedTime("");
    setAdultCount(0);
    setYouthCount(0);
    setSelectedSeats([]);
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    setSelectedMovie(null);
    setSelectedTime("");
    setAdultCount(0);
    setYouthCount(0);
    setSelectedSeats([]);
  };

  const handleMovieChange = (movieIdStr: string) => {
    const movie = nowPlayingMovies.find((m) => String(m.id) === movieIdStr);
    setSelectedMovie(movie || null);
    setSelectedTime("");
    setAdultCount(0);
    setYouthCount(0);
    setSelectedSeats([]);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setAdultCount(0);
    setYouthCount(0);
    setSelectedSeats([]);
  };

  const handleAdultChange = (delta: number) => {
    const next = adultCount + delta;
    if (next < 0) return;
    setAdultCount(next);
    setSelectedSeats([]);
  };

  const handleYouthChange = (delta: number) => {
    const next = youthCount + delta;
    if (next < 0) return;
    setYouthCount(next);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId: string) => {
    if (totalPeople === 0) {
      alert("5단계 인원수를 먼저 설정해주세요.");
      return;
    }

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

  // ✅ 결제 팝업창 열기
  const handleBooking = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (totalPrice <= 0) {
      alert("관람 인원과 좌석을 선택해주세요.");
      return;
    }

    const width = 600;
    const height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const movieTitle = encodeURIComponent(selectedMovie?.title || "영화 예매");
    const popupUrl = `/payment-popup?amount=${totalPrice}&orderName=${movieTitle}`;

    window.open(
      popupUrl,
      "paymentPopup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    switch (key) {
      case "brand":
        handleCinemaChange(value);
        break;
      case "city":
        handleCityChange(value);
        break;
      case "gu":
        handleGuChange(value);
        break;
      case "branch":
        handleBranchChange(value);
        break;
      case "movie":
        handleMovieChange(value);
        break;
      case "time":
        handleTimeChange(value);
        break;
      default:
        break;
    }
  };

  const stepPermissions = useMemo(() => {
    return validateStepAvailability({
      brand: selectedCinema,
      city: selectedCity,
      gu: selectedGu,
      branch: selectedBranch,
      movieId: selectedMovie ? String(selectedMovie.id) : "",
      time: selectedTime,
      adultCount,
      youthCount,
      seats: selectedSeats,
    });
  }, [
    selectedCinema,
    selectedCity,
    selectedGu,
    selectedBranch,
    selectedMovie,
    selectedTime,
    adultCount,
    youthCount,
    selectedSeats,
  ]);

  const renderPeople = () => (
    <div
      style={{
        backgroundColor: "#222228",
        padding: "12px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
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
  );

  const filterConfigData = useMemo(() => {
    return getFilterMainForm({
      cinemas,
      cityList,
      guList,
      branchList,
      nowPlayingMovies,
      timeSlots: TIME_SLOTS,
      selectedValues: {
        cinema: selectedCinema,
        city: selectedCity,
        gu: selectedGu,
        branch: selectedBranch,
        movie: selectedMovie ? String(selectedMovie.id) : "",
        time: selectedTime,
      },
      stepPermissions,
      renderPeople,
    });
  }, [
    cinemas,
    cityList,
    guList,
    branchList,
    nowPlayingMovies,
    selectedCinema,
    selectedCity,
    selectedGu,
    selectedBranch,
    selectedMovie,
    selectedTime,
    stepPermissions,
    adultCount,
    youthCount,
  ]);

  return (
    <div style={{ backgroundColor: "#0f0f12", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* 1. 메인 배너 */}
      <section style={{ padding: "30px 40px 0", maxWidth: "1280px", margin: "0 auto" }}>
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
                <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "12px", lineHeight: "1.3" }}>
                  {event.title}
                </h1>
                <p style={{ color: "#ddd", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "16px" }}>
                  {event.subtitle}
                </p>
                <p style={{ color: "#aaa", fontSize: "0.85rem", fontWeight: "500" }}>
                  📅 이벤트 기간: {event.period}
                </p>
              </div>
            </div>
          ))}

          <div style={{ position: "absolute", bottom: "35px", right: "50px", display: "flex", gap: "10px" }}>
            {activeEvents.map((_, index) => (
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

      {/* 2. 빠른 이동 */}
      <section style={{ padding: "60px 40px", maxWidth: "1280px", margin: "0 auto" }}>
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
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            빠른 이동
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {cinemas.map((item) => (
            <Card
              key={item.cinemaName}
              center={true}
              image={item.cinemaImg}
              title={item.cinemaName}
              backgroundcolor="#fff"
              BT={
                <Button
                  width="100%"
                  title="빠른이동"
                  isSelected={true}
                  onClick={() => {
                    window.location.href = item.cinemaSite;
                  }}
                />
              }
            />
          ))}
        </div>
      </section>

      {/* 3. 빠른 예매 영역 */}
      <section id="booking" style={{ padding: "0 40px 60px", maxWidth: "1280px", margin: "0 auto" }}>
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
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            빠른 예매
          </h2>
        </div>

        <CardForm filterconfig={filterConfigData} onChange={handleFilterChange} />

        {/* 6. 좌석 선택 및 결제 영수증 박스 */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "#18181c",
            borderRadius: "16px",
            border: "1px solid #2a2a30",
            boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
            padding: "24px",
            opacity: stepPermissions.canAccessStep6 ? 1 : 0.3,
            pointerEvents: stepPermissions.canAccessStep6 ? "auto" : "none",
            userSelect: stepPermissions.canAccessStep6 ? "auto" : "none",
            transition: "opacity 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", color: "#eee", fontWeight: "700" }}>💺 6. 좌석 선택 및 결제</h3>
            {!stepPermissions.canAccessStep6 && (
              <span style={{ fontSize: "0.8rem", color: "#e50914" }}>
                * 1~5단계를 순서대로 완료해야 좌석을 지정할 수 있습니다.
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1.2fr",
              gap: "30px",
              alignItems: "center",
            }}
          >
            {/* 왼쪽: 스크린 & 좌석 그리드 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#121215",
                borderRadius: "12px",
                border: "1px solid #222228",
              }}
            >
              <div
                style={{
                  width: "80%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255) 100%)",
                  borderTop: "3px solid #fff",
                  textAlign: "center",
                  padding: "6px",
                  marginBottom: "28px",
                  fontSize: "0.8rem",
                  letterSpacing: "6px",
                  color: "#ccc",
                }}
              >
                SCREEN
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ROWS.map((row) => (
                  <div key={row} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ width: "20px", color: "#666", fontSize: "0.85rem", fontWeight: "bold" }}>
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

            {/* 오른쪽: 상세 내역 및 결제 영수증 */}
            <div
              style={{
                backgroundColor: "#222228",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #2e2e36",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "0.95rem", color: "#ff4d4d", fontWeight: "bold" }}>
                  [{selectedCinema || "브랜드 미선택"}]{" "}
                  {selectedBranch ? `${selectedCity} > ${selectedGu} > ${selectedBranch}` : "지점 미선택"}
                </div>
                <div style={{ fontSize: "1rem", color: "#fff", fontWeight: "600" }}>
                  {selectedMovie?.title || "영화 미선택"}{" "}
                  {selectedTime ? `(${selectedTime})` : "(시간 미선택)"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#bbb", marginTop: "4px" }}>
                  인원: 성인 {adultCount}명, 청소년 {youthCount}명 (총 {totalPeople}명)
                </div>
                <div style={{ fontSize: "0.85rem", color: "#bbb" }}>
                  선택 좌석:{" "}
                  <span style={{ color: "#fff", fontWeight: "bold" }}>
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "미선택"}
                  </span>{" "}
                  ({selectedSeats.length}/{totalPeople})
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #33333d",
                    paddingTop: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#aaa", fontSize: "0.9rem" }}>총 결제 금액</span>
                  <span style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "1.3rem" }}>
                    {totalPrice.toLocaleString()} 원
                  </span>
                </div>

                <Button
                  title="예매하기"
                  isSelected={stepPermissions.isComplete}
                  width="100%"
                  onClick={(e) => handleBooking(e)}
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
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            현재 상영작
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {nowPlayingMovies.map((movie) => {
            const poster = movie.posterPath || movie.poster_path;
            const vote = movie.voteAverage ?? movie.vote_average;

            return (
              <Card
                key={movie.id}
                image={poster ? `${IMAGE_BASE_URL}${poster}` : NO_IMAGE_URL}
                title={movie.title}
                genre={`평점 ⭐ ${vote ? Number(vote).toFixed(1) : "0.0"}`}
                BT={
                  <Button
                    title="바로 예매"
                    width="100%"
                    isSelected={true}
                    onClick={() => {
                      setSelectedMovie(movie);
                      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                }
              />
            );
          })}
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
            <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }}></span>
            개봉 예정작
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {upcomingMovies.map((movie) => {
            const poster = movie.posterPath || movie.poster_path;
            const rDate = movie.releaseDate || movie.release_date;

            return (
              <Card
                key={movie.id}
                image={poster ? `${IMAGE_BASE_URL}${poster}` : NO_IMAGE_URL}
                title={movie.title}
                genre={`개봉일: ${rDate || "미정"}`}
                BT={
                  <Button
                    width="100%"
                    title="🔔 개봉 알림 받기"
                    isSelected={false}
                    onClick={() => alert(`${movie.title} 알림 신청이 완료되었습니다.`)}
                  />
                }
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}