// hooks/useBooking.ts
import { useState, useMemo, useCallback, useEffect } from "react";
import { CinemaLocation, CinemaLocation as CinemaLocationType } from "@/service/CinemaLocation";
import { validateStepAvailability } from "@/components/custom/CardForm";
import { MovieType } from "@/types/movie"; // MovieType 인터페이스를 별도 파일로 관리한다고 가정

export const PRICE_ADULT = 15000;
export const PRICE_YOUTH = 11000;

interface BookingState {
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

const INITIAL_STATE: BookingState = {
  cinema: "", city: "", gu: "", branch: "",
  movie: null, time: "", adultCount: 0, youthCount: 0, seats: [],
};

export function useBooking() {
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);
  const [locationCinema, setLocationCinema] = useState<Record<string, CinemaLocationType[]>>({});

  const totalPeople = booking.adultCount + booking.youthCount;
  const totalPrice = booking.adultCount * PRICE_ADULT + booking.youthCount * PRICE_YOUTH;

  // 1. 영화관 위치 데이터 로드
  const fetchLocations = useCallback(async (cinemaName: string) => {
    if (!cinemaName || locationCinema[cinemaName]) return;
    try {
      const data = await CinemaLocation(cinemaName);
      if (Array.isArray(data)) {
        setLocationCinema((prev) => ({ ...prev, [cinemaName]: data }));
      }
    } catch (error) {
      console.error("영화관 위치 로드 실패:", error);
    }
  }, [locationCinema]);

  useEffect(() => {
    if (booking.cinema) fetchLocations(booking.cinema);
  }, [booking.cinema, fetchLocations]);

  // 2. 위치 데이터 계층 파싱 (메모이제이션)
  const locationTree = useMemo(() => {
    const rawList = locationCinema[booking.cinema] || [];
    const tree: Record<string, Record<string, string[]>> = {};

    rawList.forEach((item) => {
      if (!item.cinemaLocation) return;
      const [city, gu, branch] = item.cinemaLocation.split(">").map((s) => s.trim());
      
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
  }, [booking.cinema, locationCinema]);

  const cityList = useMemo(() => Object.keys(locationTree), [locationTree]);
  const guList = useMemo(() => (booking.city ? Object.keys(locationTree[booking.city] || {}) : []), [locationTree, booking.city]);
  const branchList = useMemo(() => (booking.city && booking.gu ? locationTree[booking.city]?.[booking.gu] || [] : []), [locationTree, booking.city, booking.gu]);

  // 3. 필터 체인 변경 (하위 단계 자동 초기화)
  const handleFilterChange = useCallback((key: keyof BookingState, value: any) => {
    setBooking((prev) => {
      const next = { ...prev, [key]: value };
      switch (key) {
        case "cinema": return { ...next, city: "", gu: "", branch: "", movie: null, time: "", adultCount: 0, youthCount: 0, seats: [] };
        case "city": return { ...next, gu: "", branch: "", movie: null, time: "", adultCount: 0, youthCount: 0, seats: [] };
        case "gu": return { ...next, branch: "", movie: null, time: "", adultCount: 0, youthCount: 0, seats: [] };
        case "branch": return { ...next, movie: null, time: "", adultCount: 0, youthCount: 0, seats: [] };
        case "movie": return { ...next, time: "", adultCount: 0, youthCount: 0, seats: [] };
        case "time": return { ...next, adultCount: 0, youthCount: 0, seats: [] };
        default: return next;
      }
    });
  }, []);

  const handleCountChange = useCallback((type: "adult" | "youth", delta: number) => {
    setBooking((prev) => {
      const key = type === "adult" ? "adultCount" : "youthCount";
      const nextCount = prev[key] + delta;
      if (nextCount < 0) return prev;
      return { ...prev, [key]: nextCount, seats: [] }; // 인원 변경 시 좌석 초기화
    });
  }, []);

  const toggleSeat = useCallback((seatId: string) => {
    if (totalPeople === 0) {
      alert("인원수를 먼저 설정해주세요.");
      return;
    }
    setBooking((prev) => {
      if (prev.seats.includes(seatId)) {
        return { ...prev, seats: prev.seats.filter((s) => s !== seatId) };
      }
      if (prev.seats.length >= totalPeople) {
        alert(`선택한 관람 인원(${totalPeople}명)을 초과할 수 없습니다.`);
        return prev;
      }
      return { ...prev, seats: [...prev.seats, seatId] };
    });
  }, [totalPeople]);

  const stepPermissions = useMemo(() => validateStepAvailability({
    brand: booking.cinema,
    city: booking.city,
    gu: booking.gu,
    branch: booking.branch,
    movieId: booking.movie ? String(booking.movie.id) : "",
    time: booking.time,
    adultCount: booking.adultCount,
    youthCount: booking.youthCount,
    seats: booking.seats,
  }), [booking]);

  return {
    booking, cityList, guList, branchList,
    totalPeople, totalPrice, stepPermissions,
    handleFilterChange, handleCountChange, toggleSeat,
  };
}