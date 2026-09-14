import React from "react";

export const Card = ({
  backgroundcolor,
  image,
  title,
  genre,
  BT,
  center,
  TEXTInfo,
}: {
  backgroundcolor?: string;
  image?: string;
  title: string;
  genre?: string;
  center?: boolean;
  TEXTInfo?: React.ReactNode;
  BT?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        backgroundColor: "#18181c",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #2a2a30",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* 
        최대 높이 150px 고정 + contain
        - 이미지가 절대 잘리지 않음 (Crop 없음)
        - 가로/세로 비율 100% 원본 유지 (찌그러짐 없음)
      */}
      <div
        style={{
          width: "100%",
          height: "100%", // 👈 최대/고정 높이 150px
          backgroundColor: backgroundcolor || "#121215",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "6px",
          boxSizing: "border-box",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "cover", // 👈 잘림 없이 전체 표시
              display: "block",
            }}
          />
        ) : (
          <span style={{ color: "#555", fontSize: "0.75rem" }}>NO IMAGE</span>
        )}
      </div>

      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ textAlign: center ? "center" : "left" }}>
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: "700",
              color: "#fff",
              margin: "0 0 4px 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={title}
          >
            {title}
          </h3>

          {genre && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#aaa",
                margin: "0 0 6px 0",
              }}
            >
              {genre}
            </p>
          )}

          {TEXTInfo}
        </div>

        {BT}
      </div>
    </div>
  );
};