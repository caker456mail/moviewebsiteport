export default function Footer(){
    return(
    <footer
        style={{
          borderTop: "1px solid #222228",
          backgroundColor: "#0a0a0c",
          padding: "40px",
          color: "#888",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "16px", fontWeight: "bold" }}>
            <a href="#company" style={{ color: "#ccc", textDecoration: "none" }}>
              회사소개
            </a>
            <span>|</span>
            <a href="#terms" style={{ color: "#ccc", textDecoration: "none" }}>
              이용약관
            </a>
            <span>|</span>
            <a href="#privacy" style={{ color: "#ff4d4d", textDecoration: "none" }}>
              개인정보처리방침
            </a>
          </div>

          <p style={{ lineHeight: "1.6", margin: "0 0 10px 0" }}>
            (주) 영화예매 프로젝트 | 대표이사: 홍길동 | 사업자등록번호: 000-00-00000 | 통신판매업신고번호: 2026-서울강남-0000
            <br />
            주소: 서울특별시 강남구 테헤란로 123 4층 | 고객센터: 1588-0000 (평일 09:00~18:00)
          </p>

          <p style={{ margin: 0, color: "#555" }}>
            &copy; 2026 Cinema Booking Inc. All rights reserved.
          </p>
        </div>
      </footer>
    )
}