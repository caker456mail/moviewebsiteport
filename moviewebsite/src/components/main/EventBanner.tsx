import React, { useMemo } from "react";
import { useBannerSlider } from "@/hook/useBannerSlider";


export interface EventItem {
  id: number | string;
  category: string;
  title: string;
  subtitle: string;
  period: string;
  imageUrl: string;
  isEnded?: boolean;
}

interface EventBannerProps {
  events: EventItem[];
  intervalMs?: number;
}

export function EventBanner({ events, intervalMs = 4000 }: EventBannerProps) {
  const activeEvents = useMemo(() => events.filter((e) => !e.isEnded), [events]);

  const { currentSlide, goToSlide, pause, resume } = useBannerSlider({
    totalSlides: activeEvents.length,
    intervalMs,
  });

  if (activeEvents.length === 0) return null;

  return (
    <section className="event-banner-section">
      <div
        className="responsive-banner-box"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {activeEvents.map((event, index) => {
          const isActive = currentSlide === index;

          return (
            <div
              key={event.id}
              className={`responsive-banner-item ${isActive ? "active" : ""}`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(18, 18, 18, 0.45) 60%, rgba(18, 18, 18, 0.9) 100%), url(${event.imageUrl})`,
              }}
            >
              <div className="responsive-banner-content">
                <span className="responsive-banner-badge">
                  🎉 {event.category}
                </span>
                <h1 className="responsive-banner-title">
                  {event.title}
                </h1>
                <p className="responsive-banner-subtitle">
                  {event.subtitle}
                </p>
                <p className="responsive-banner-period">
                  📅 이벤트 기간: {event.period}
                </p>
              </div>
            </div>
          );
        })}

        {/* 인디케이터 점 버튼 */}
        <div className="banner-indicator-group">
          {activeEvents.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`슬라이드 ${index + 1}번으로 이동`}
              onClick={() => goToSlide(index)}
              className={`banner-indicator-dot ${currentSlide === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}