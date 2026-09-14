import React, { useMemo, useCallback } from "react";
import { TIME_SLOTS, ROWS } from "@/hardCordingData/Movieinfo";
import { Button } from "@/components/ui/Button";
import { CinemaItem } from "@/service/CinemaName";
import { CardForm, validateStepAvailability } from "@/components/custom/CardForm";
import { getFilterMainForm } from "@/feature/FilterConfig";

const PRICE_ADULT = 15000;
const PRICE_YOUTH = 11000;

export interface MovieType {
  id: number;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  voteAverage: number;
  releaseDate: string;
}

export interface BookingState {
  cinema: string;
  city: string;
  gu: string;
  branch: string;
  movie: MovieType | null;
  time: string;
  adultCount: number;
  youthCount: number;
  seats: string[];
}

interface BookingSectionProps {
  cinemas: CinemaItem[];
  cityList: string[];
  guList: string[];
  branchList: string[];
  movies: MovieType[];
  booking: BookingState;
  totalPeople: number;
  totalPrice: number;
  onFilterChange: (key: string, value: string) => void;
  onAdultChange: (delta: number) => void;
  onYouthChange: (delta: number) => void;
  onToggleSeat: (seatId: string) => void;
  onBooking: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  cinemas,
  cityList,
  guList,
  branchList,
  movies,
  booking,
  totalPeople,
  totalPrice,
  onFilterChange,
  onAdultChange,
  onYouthChange,
  onToggleSeat,
  onBooking,
}) => {
  const stepPermissions = useMemo(
    () =>
      validateStepAvailability({
        brand: booking.cinema,
        city: booking.city,
        gu: booking.gu,
        branch: booking.branch,
        movieId: booking.movie ? String(booking.movie.id) : "",
        time: booking.time,
        adultCount: booking.adultCount,
        youthCount: booking.youthCount,
        seats: booking.seats,
      }),
    [
      booking.cinema,
      booking.city,
      booking.gu,
      booking.branch,
      booking.movie,
      booking.time,
      booking.adultCount,
      booking.youthCount,
      booking.seats,
    ]
  );

  const renderPeople = useCallback(
    () => (
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
            <Button title="-" isSelected={false} onClick={() => onAdultChange(-1)} />
            <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{booking.adultCount}</span>
            <Button title="+" isSelected={false} onClick={() => onAdultChange(1)} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#ccc" }}>청소년 (11,000원)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button title="-" isSelected={false} onClick={() => onYouthChange(-1)} />
            <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{booking.youthCount}</span>
            <Button title="+" isSelected={false} onClick={() => onYouthChange(1)} />
          </div>
        </div>
      </div>
    ),
    [booking.adultCount, booking.youthCount, onAdultChange, onYouthChange]
  );

  const filterConfigData = useMemo(
    () =>
      getFilterMainForm({
        sourceData: {
          cinemas,
          cityList,
          guList,
          branchList,
          movies,
          timeSlots: TIME_SLOTS,
        },
        selectedValues: {
          cinema: booking.cinema,
          city: booking.city,
          gu: booking.gu,
          branch: booking.branch,
          movie: booking.movie ? String(booking.movie.id) : "",
          time: booking.time,
        },
        stepPermissions,
        renderPeople,
      }),
    [
      cinemas,
      cityList,
      guList,
      branchList,
      movies,
      booking.cinema,
      booking.city,
      booking.gu,
      booking.branch,
      booking.movie,
      booking.time,
      stepPermissions,
      renderPeople,
    ]
  );

  return (
    <section id="booking" className="booking-section-wrapper">
      {/* 📱 인라인 반응형 미디어 쿼리 스타일 */}
      <style>{`
        .booking-section-wrapper {
          padding: 0 40px 60px;
          max-width: 1280px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .booking-step6-container {
          margin-top: 24px;
          background-color: #18181c;
          border-radius: 16px;
          border: 1px solid #2a2a30;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
          padding: 24px;
          transition: opacity 0.2s ease;
          box-sizing: border-box;
        }

        .booking-step6-grid {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 30px;
          align-items: stretch;
        }

        .seat-grid-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 20px;
          background-color: #121215;
          border-radius: 12px;
          border: 1px solid #222228;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .seat-layout-inner {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 320px;
        }

        .receipt-summary-box {
          background-color: #222228;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #2e2e36;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          min-height: 260px;
          box-sizing: border-box;
        }

        /* 📱 모바일/태블릿 반응형 (1024px 이하) */
        @media (max-width: 1024px) {
          .booking-section-wrapper {
            padding: 0 20px 40px;
          }

          .booking-step6-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .booking-step6-container {
            padding: 16px;
          }

          .receipt-summary-box {
            padding: 20px;
            min-height: auto;
          }
        }

        /* 📱 초소형 스마트폰 (480px 이하) */
        @media (max-width: 480px) {
          .booking-section-wrapper {
            padding: 0 14px 30px;
          }

          .seat-grid-box {
            padding: 16px 10px;
          }
        }
      `}</style>

      {/* 헤더 */}
     

      {/* 1~5단계 필터 카드 폼 */}
      <CardForm filterconfig={filterConfigData} onChange={onFilterChange} />

      {/* 6단계: 좌석 선택 및 영수증 컨테이너 */}
      <div
        className="booking-step6-container"
        style={{
          opacity: stepPermissions.canAccessStep6 ? 1 : 0.3,
          pointerEvents: stepPermissions.canAccessStep6 ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", color: "#eee", fontWeight: "700", margin: 0 }}>
            💺 6. 좌석 선택 및 결제
          </h3>
          {!stepPermissions.canAccessStep6 && (
            <span style={{ fontSize: "0.8rem", color: "#e50914" }}>
              * 1~5단계를 순서대로 완료해야 좌석을 지정할 수 있습니다.
            </span>
          )}
        </div>

        <div className="booking-step6-grid">
          {/* 좌측: 스크린 & 좌석 그리드 */}
          <div className="seat-grid-box">
            <div
              style={{
                width: "80%",
                maxWidth: "360px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255) 100%)",
                borderTop: "3px solid #fff",
                textAlign: "center",
                padding: "6px",
                marginBottom: "24px",
                fontSize: "0.8rem",
                letterSpacing: "6px",
                color: "#ccc",
              }}
            >
              SCREEN
            </div>

            {/* 좌석 영역 (작은 폰에서도 잘리지 않도록 min-width + 부모 스크롤 처리) */}
            <div className="seat-layout-inner">
              {ROWS.map((row) => (
                <div key={row} style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: "18px", color: "#666", fontSize: "0.85rem", fontWeight: "bold", textAlign: "center" }}>
                    {row}
                  </span>
                  {Array.from({ length: 8 }).map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    return (
                      <Button
                        key={seatId}
                        title={String(i + 1)}
                        isSelected={booking.seats.includes(seatId)}
                        onClick={() => onToggleSeat(seatId)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 상세 내역 및 결제 영수증 박스 */}
          <div className="receipt-summary-box">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "0.95rem", color: "#ff4d4d", fontWeight: "bold" }}>
                [{booking.cinema || "브랜드 미선택"}]{" "}
                {booking.branch ? `${booking.city} > ${booking.gu} > ${booking.branch}` : "지점 미선택"}
              </div>
              <div style={{ fontSize: "1.05rem", color: "#fff", fontWeight: "600" }}>
                {booking.movie?.title || "영화 미선택"} {booking.time ? `(${booking.time})` : "(시간 미선택)"}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#bbb", marginTop: "4px" }}>
                인원: 성인 {booking.adultCount}명, 청소년 {booking.youthCount}명 (총 {totalPeople}명)
              </div>
              <div style={{ fontSize: "0.85rem", color: "#bbb" }}>
                선택 좌석:{" "}
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  {booking.seats.length > 0 ? booking.seats.join(", ") : "미선택"}
                </span>{" "}
                ({booking.seats.length}/{totalPeople})
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #33333d",
                  paddingTop: "14px",
                  marginBottom: "14px",
                }}
              >
                <span style={{ color: "#aaa", fontSize: "0.9rem" }}>총 결제 금액</span>
                <span style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "1.35rem" }}>
                  {totalPrice.toLocaleString()} 원
                </span>
              </div>
              <Button
                title="예매하기"
                isSelected={stepPermissions.isComplete}
                width="100%"
                onClick={onBooking}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};