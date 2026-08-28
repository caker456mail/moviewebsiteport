"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import {events,EventItem} from "@/hardCordingData/Event"

export default function Event() {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [statusFilter, setStatusFilter] = useState<"ongoing" | "ended">("ongoing");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // 샘플 이벤트 데이터
 

  // 필터링된 이벤트 목록
  const filteredEvents = events.filter((event) => {
    // 진행중 / 종료 구분
    const matchesStatus = statusFilter === "ongoing" ? !event.isEnded : event.isEnded;
    // 카테고리 구분
    const matchesCategory = activeCategory === "전체" || event.category === activeCategory;
    return matchesStatus && matchesCategory;
  });

  const categories = ["전체", "시사회/무대인사", "영화/예매", "제휴/혜택"];

  return (
    <>
      <Menu />

      <div style={containerStyle}>
        <div style={innerStyle}>
          {/* 헤더 섹션 */}
          <div style={headerStyle}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#fff" }}>
              🎉 이벤트 & 혜택
            </h1>
            <p style={{ color: "#aaa", marginTop: "8px", fontSize: "1rem" }}>
              다양한 시사회, 할인 쿠폰, 제휴 혜택 이벤트를 확인하고 참여해보세요!
            </p>
          </div>

          {/* 진행중 / 종료 탭 버튼 */}
          <div style={statusTabStyle}>
            <button
              onClick={() => setStatusFilter("ongoing")}
              style={{
                ...statusButtonStyle,
                borderBottom: statusFilter === "ongoing" ? "3px solid #e50914" : "none",
                color: statusFilter === "ongoing" ? "#fff" : "#888",
                fontWeight: statusFilter === "ongoing" ? "bold" : "normal",
              }}
            >
              진행중인 이벤트 ({events.filter((e) => !e.isEnded).length})
            </button>
            <button
              onClick={() => setStatusFilter("ended")}
              style={{
                ...statusButtonStyle,
                borderBottom: statusFilter === "ended" ? "3px solid #e50914" : "none",
                color: statusFilter === "ended" ? "#fff" : "#888",
                fontWeight: statusFilter === "ended" ? "bold" : "normal",
              }}
            >
              지난 이벤트 ({events.filter((e) => e.isEnded).length})
            </button>
          </div>

          {/* 카테고리 필터 버튼 */}
          <div style={categoryContainerStyle}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...categoryBtnStyle,
                  backgroundColor: activeCategory === cat ? "#e50914" : "#222228",
                  color: activeCategory === cat ? "#fff" : "#aaa",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 이벤트 카드 리스트 Grid */}
          {filteredEvents.length > 0 ? (
            <div style={gridStyle}>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  style={cardStyle}
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* 이미지 및 카테고리 태그 */}
                  <div style={imageWrapperStyle}>
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        filter: event.isEnded ? "grayscale(80%)" : "none",
                      }}
                    />
                    <span style={badgeStyle}>{event.category}</span>
                  </div>

                  {/* 카드 텍스트 내용 */}
                  <div style={cardContentStyle}>
                    <h3 style={cardTitleStyle}>{event.title}</h3>
                    <p style={cardSubtitleStyle}>{event.subtitle}</p>
                    <div style={periodStyle}>🗓️ {event.period}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStyle}>해당 조건에 맞는 이벤트가 없습니다.</div>
          )}
        </div>
      </div>

      {/* 이벤트 상세 모달 Popup */}
      {selectedEvent && (
        <div style={modalBackdropStyle} onClick={() => setSelectedEvent(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
            />
            <div style={{ padding: "24px" }}>
              <span style={{ ...badgeStyle, position: "static", display: "inline-block", marginBottom: "12px" }}>
                {selectedEvent.category}
              </span>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
                {selectedEvent.title}
              </h2>
              <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "16px" }}>
                기간: {selectedEvent.period}
              </p>

              <div
                style={{
                  backgroundColor: "#222228",
                  padding: "16px",
                  borderRadius: "8px",
                  color: "#ddd",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                  marginBottom: "20px",
                }}
              >
                {selectedEvent.content}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                {!selectedEvent.isEnded && (
                  <button
                    onClick={() => {
                      alert("이벤트 응모 및 혜택이 정상적으로 적용되었습니다.");
                      setSelectedEvent(null);
                    }}
                    style={{
                      backgroundColor: "#e50914",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    이벤트 참여하기
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    backgroundColor: "#3a3a42",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

const innerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 20px 0",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "30px",
};

const statusTabStyle: React.CSSProperties = {
  display: "flex",
  gap: "24px",
  borderBottom: "1px solid #2a2a30",
  marginBottom: "24px",
};

const statusButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  paddingBottom: "12px",
  fontSize: "1.1rem",
  cursor: "pointer",
};

const categoryContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const categoryBtnStyle: React.CSSProperties = {
  border: "none",
  padding: "8px 18px",
  borderRadius: "20px",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "24px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #2a2a30",
  cursor: "pointer",
  transition: "transform 0.2s ease, border-color 0.2s ease",
};

const imageWrapperStyle: React.CSSProperties = {
  position: "relative",
};

const badgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: "rgba(229, 9, 20, 0.9)",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "0.75rem",
  fontWeight: "bold",
};

const cardContentStyle: React.CSSProperties = {
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: "bold",
  color: "#fff",
  lineHeight: "1.4",
};

const cardSubtitleStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#aaa",
  lineHeight: "1.4",
};

const periodStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#888",
  marginTop: "6px",
};

const emptyStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "80px 0",
  color: "#666",
  fontSize: "1.1rem",
};

// 모달 스타일
const modalBackdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  borderRadius: "16px",
  maxWidth: "500px",
  width: "100%",
  border: "1px solid #333",
  overflow: "hidden",
};