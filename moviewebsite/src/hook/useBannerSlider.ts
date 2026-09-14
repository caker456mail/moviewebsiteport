import { useState, useEffect, useCallback, useRef } from "react";

interface UseBannerSliderProps {
  totalSlides: number;
  intervalMs?: number;
}

export function useBannerSlider({ totalSlides, intervalMs = 4000 }: UseBannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(nextSlide, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, intervalMs, isPaused, nextSlide]);

  return {
    currentSlide,
    goToSlide,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  };
}