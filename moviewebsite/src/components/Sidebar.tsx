import React from "react";
import {MenuItem} from "@/feature/Sidebar/Sidebar.ts";
export default function Sidebar() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#1f1f1f",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#e50914", cursor: "pointer" }}>
        🎬 MOVIE
      </div>

      {/* 3. map()을 사용해 동적으로 네비게이션 생성 */}
      <nav style={{ display: "flex", gap: "30px" }}>
        {MenuItem.map((item) => (
          <a
            key={item.id}
            href={item.path}
            style={{
              color: item.id === 1 ? "#fff" : "#aaa", // 예시: 홈 버튼만 흰색 강조
              textDecoration: "none",
              fontWeight: item.id === 1 ? "bold" : "normal",
            }}
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#e50914",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          홍
        </div>
        <span style={{ fontWeight: "500", color: "#fff" }}>홍길동</span>
      </div>
    </header>
  );
}