import { useState, useEffect, useMemo, useCallback } from "react";
import { events } from "@/hardCordingData/Event";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/custom/Card";
import { CinemaName, CinemaItem } from "@/service/CinemaName";
import { CinemaLocation, CinemaLocation as CinemaLocationType } from "@/service/CinemaLocation";
import { getMovies } from "@/service/MovieService";
import { EventBanner } from "@/components/main/EventBanner";
import { BookingSection, BookingState, MovieType } from "@/components/main/BookingSection";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const NO_IMG_URL = "https://dummyimage.com/500x750/1c1c22/ffffff&text=No+Image";
const PRICE = { ADULT: 15000, YOUTH: 11000 };

const resolvePosterUrl = (path?: string) => {
  if (!path || path === "null" || path === "undefined") return NO_IMG_URL;
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${IMG_BASE_URL}${cleanPath}`;
};

const INITIAL_BOOKING: BookingState = {
  cinema: "",
  city: "",
  gu: "",
  branch: "",
  movie: null,
  time: "",
  adultCount: 0,
  youthCount: 0,
  seats: [],
};

const RESET_STEPS: (keyof BookingState)[] = ["cinema", "city", "gu", "branch", "movie", "time"];

export default function MainPage() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [cinemas, setCinemas] = useState<CinemaItem[]>([]);
  const [locations, setLocations] = useState<Record<string, CinemaLocationType[]>>({});
  const [booking, setBooking] = useState<BookingState>(INITIAL_BOOKING);

  const totalPeople = booking.adultCount + booking.youthCount;
  const totalPrice = booking.adultCount * PRICE.ADULT + booking.youthCount * PRICE.YOUTH;

  useEffect(() => {
    Promise.all([
      getMovies().catch((err) => {
        console.error("getMovies 에러:", err);
        return [];
      }),
      CinemaName().catch(() => []),
    ]).then(([mList, cList]) => {
      const normalized: MovieType[] = mList.map((item: any) => ({
        id: item.id,
        title: item.title,
        posterPath: item.posterUrl || item.posterPath || item.poster_path,
        backdropPath: item.backdropUrl || item.backdropPath || item.backdrop_path,
        voteAverage: Number(item.voteAverage ?? item.vote_average ?? 0),
        releaseDate: item.releaseDate || item.release_date || "미정",
      }));

      setMovies(normalized);
      if (cList) setCinemas(cList);
    });
  }, []);

  const fetchLocations = useCallback(
    async (name: string) => {
      if (!name || locations[name]) return;
      const res = await CinemaLocation(name).catch(() => null);
      if (Array.isArray(res)) setLocations((prev) => ({ ...prev, [name]: res }));
    },
    [locations]
  );

  useEffect(() => {
    if (booking.cinema) fetchLocations(booking.cinema);
  }, [booking.cinema, fetchLocations]);

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "PAYMENT_SUCCESS") {
        alert(`결제 완료! (주문번호: ${e.data.orderId})`);
        window.location.href = "/profile";
      } else if (e.data?.type === "PAYMENT_FAIL") {
        alert(`결제 실패: ${e.data.message}`);
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  const locationTree = useMemo(() => {
    const list = locations[booking.cinema] || [];
    const tree: Record<string, Record<string, string[]>> = {};

    list.forEach((item) => {
      if (!item.cinemaLocation) return;
      const [city, gu, branch] = item.cinemaLocation.split(">").map((s) => s.trim());
      if (!city) return;
      tree[city] = tree[city] || {};
      if (gu) {
        tree[city][gu] = tree[city][gu] || [];
        if (branch && !tree[city][gu].includes(branch)) tree[city][gu].push(branch);
      }
    });
    return tree;
  }, [booking.cinema, locations]);

  const cityList = useMemo(() => Object.keys(locationTree), [locationTree]);
  const guList = useMemo(
    () => (booking.city ? Object.keys(locationTree[booking.city] || {}) : []),
    [locationTree, booking.city]
  );
  const branchList = useMemo(
    () => (booking.city && booking.gu ? locationTree[booking.city]?.[booking.gu] || [] : []),
    [locationTree, booking.city, booking.gu]
  );

  const handleFilterChange = (key: string, value: string) => {
    const fieldMap: Record<string, keyof BookingState> = {
      brand: "cinema",
      city: "city",
      gu: "gu",
      branch: "branch",
      movie: "movie",
      time: "time",
    };
    const target = fieldMap[key];
    if (!target) return;

    const stepIdx = RESET_STEPS.indexOf(target);
    setBooking((prev) => {
      const next = { ...prev, seats: [], adultCount: 0, youthCount: 0 };
      RESET_STEPS.slice(stepIdx + 1).forEach((f) => {
        (next as any)[f] = f === "movie" ? null : "";
      });

      if (target === "movie") {
        next.movie = movies.find((m) => String(m.id) === value) || null;
      } else {
        (next as any)[target] = value;
      }
      return next;
    });
  };

  const handleCountChange = (type: "adult" | "youth", delta: number) => {
    setBooking((prev) => {
      const key = type === "adult" ? "adultCount" : "youthCount";
      const val = prev[key] + delta;
      return val >= 0 ? { ...prev, [key]: val, seats: [] } : prev;
    });
  };

  const handleToggleSeat = (seatId: string) => {
    if (totalPeople === 0) return alert("인원수를 먼저 설정해주세요.");
    setBooking((prev) => {
      const isExist = prev.seats.includes(seatId);
      if (!isExist && prev.seats.length >= totalPeople) {
        alert(`선택한 관람 인원(${totalPeople}명)을 초과할 수 없습니다.`);
        return prev;
      }
      return {
        ...prev,
        seats: isExist ? prev.seats.filter((s) => s !== seatId) : [...prev.seats, seatId],
      };
    });
  };

  const handleBooking = () => {
    if (totalPrice <= 0) return alert("인원과 좌석을 선택해주세요.");
    const [w, h] = [600, 800];
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const title = encodeURIComponent(booking.movie?.title || "영화 예매");
    window.open(
      `/payment-popup?amount=${totalPrice}&orderName=${title}`,
      "pay",
      `width=${w},height=${h},left=${left},top=${top},scrollbars=yes`
    );
  };

  return (
    <div style={{ backgroundColor: "#0f0f12", color: "#fff", minHeight: "100vh" }}>
      {/* 4열 그리드 전용 반응형 스타일 */}
      <style>{`
        .four-column-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .four-column-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .four-column-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>

      {/* 1. 메인 배너 */}
      <EventBanner events={events} intervalMs={4000} />

      {/* 2. 빠른 이동 */}
      <Section title="빠른 이동">
        <div className="four-column-grid">
          {cinemas.map((item) => (
            <Card
              key={item.cinemaName}
              center
              image={item.cinemaImg}
              title={item.cinemaName}
              backgroundcolor="#fff"
              BT={
                <Button
                  width="100%"
                  title="빠른이동"
                  isSelected
                  onClick={() => (window.location.href = item.cinemaSite)}
                />
              }
            />
          ))}
        </div>
      </Section>
      <Section title="빠른 예매">
        {/* 3. 빠른 예매 */}
        <BookingSection
          cinemas={cinemas}
          cityList={cityList}
          guList={guList}
          branchList={branchList}
          movies={movies}
          booking={booking}
          totalPeople={totalPeople}
          totalPrice={totalPrice}
          onFilterChange={handleFilterChange}
          onAdultChange={(d) => handleCountChange("adult", d)}
          onYouthChange={(d) => handleCountChange("youth", d)}
          onToggleSeat={handleToggleSeat}
          onBooking={handleBooking}
        />
      </Section>
      {/* 4. 현재 상영작 (4개씩 정렬) */}
      <Section title="현재 상영작">
        <MovieGrid
          movies={movies}
          btnTitle="바로 예매"
          onAction={(m) => {
            setBooking((prev) => ({ ...prev, movie: m, time: "", seats: [] }));
            document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </Section>

      {/* 5. 개봉 예정작 (4개씩 정렬) */}
      <Section title="개봉 예정작">
        <MovieGrid
          movies={movies}
          btnTitle="🔔 개봉 알림 받기"
          isAlert
          onAction={(m) => alert(`${m.title} 알림 신청이 완료되었습니다.`)}
        />
      </Section>
    </div>
  );
}

// ==========================================
// 공통 레이아웃 래퍼
// ==========================================
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
          <span style={{ width: "4px", height: "24px", backgroundColor: "#e50914", borderRadius: "2px" }} />
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function MovieGrid({
  movies,
  btnTitle,
  isAlert = false,
  onAction,
}: {
  movies: MovieType[];
  btnTitle: string;
  isAlert?: boolean;
  onAction: (m: MovieType) => void;
}) {
  return (
    <div className="four-column-grid">
      {movies.map((movie) => {
        const finalPoster = resolvePosterUrl(movie.posterPath);

        return (
          <Card
            key={movie.id}
            image={finalPoster}
            title={movie.title}
            genre={isAlert ? `개봉일: ${movie.releaseDate}` : `평점 ⭐ ${movie.voteAverage.toFixed(1)}`}
            BT={<Button width="100%" title={btnTitle} isSelected={!isAlert} onClick={() => onAction(movie)} />}
          />
        );
      })}
    </div>
  );
}