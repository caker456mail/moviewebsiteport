import { useState, useCallback } from "react";

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
const FIELD_MAP: Record<string, keyof BookingState> = {
  brand: "cinema",
  city: "city",
  gu: "gu",
  branch: "branch",
  movie: "movie",
  time: "time",
};

const PRICE = { ADULT: 15000, YOUTH: 11000 };

export function useMovieBooking(movies: MovieType[]) {
  const [booking, setBooking] = useState<BookingState>(INITIAL_BOOKING);

  const totalPeople = booking.adultCount + booking.youthCount;
  const totalPrice = booking.adultCount * PRICE.ADULT + booking.youthCount * PRICE.YOUTH;

  const handleFilterChange = useCallback((key: string, value: string) => {
    const target = FIELD_MAP[key];
    if (!target) return;

    const stepIdx = RESET_STEPS.indexOf(target);
    setBooking((prev) => {
      const next = { ...prev, seats: [], adultCount: 0, youthCount: 0 };
      RESET_STEPS.slice(stepIdx + 1).forEach((f) => {
        (next as Record<string, unknown>)[f] = f === "movie" ? null : "";
      });

      if (target === "movie") {
        next.movie = movies.find((m) => String(m.id) === value) || null;
      } else {
        (next as Record<string, unknown>)[target] = value;
      }
      return next;
    });
  }, [movies]);

  const handleCountChange = useCallback((type: "adult" | "youth", delta: number) => {
    setBooking((prev) => {
      const key = type === "adult" ? "adultCount" : "youthCount";
      const val = prev[key] + delta;
      return val >= 0 ? { ...prev, [key]: val, seats: [] } : prev;
    });
  }, []);

  const handleToggleSeat = useCallback((seatId: string) => {
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
  }, [totalPeople]);

  const selectMovieDirectly = useCallback((movie: MovieType) => {
    setBooking((prev) => ({ ...prev, movie, time: "", seats: [] }));
  }, []);

  const handleBooking = useCallback(() => {
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
  }, [totalPrice, booking.movie?.title]);

  return {
    booking,
    totalPeople,
    totalPrice,
    handleFilterChange,
    handleCountChange,
    handleToggleSeat,
    handleBooking,
    selectMovieDirectly,
  };
}