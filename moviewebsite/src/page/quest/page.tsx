"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

// FAQ 데이터 타입 정의
interface FAQItem {
  id: number;
  category: "예매/결제" | "관람/좌석" | "매점/쿠폰" | "회원/기타";
  question: string;
  answer: string;
}

// 1:1 문의 내역 타입 정의
interface Inquiry {
  id: number;
  category: string;
  title: string;
  content: string;
  status: "답변대기" | "답변완료";
  createdAt: string;
  answerContent?: string;
}

export default function Quest() {
  const [activeTab, setActiveTab] = useState<"faq" | "inquiry" | "myInquiries">("faq");
  const [faqCategory, setFaqCategory] = useState<string>("전체");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // 1:1 문의 입력 폼 State
  const [inquiryCategory, setInquiryCategory] = useState("예매/결제");
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");

  // 가상 문의 내역 목록 State
  const [myInquiries, setMyInquiries] = useState<Inquiry[]>([
    {
      id: 1,
      category: "예매/결제",
      title: "상영 시작 후 환불이 가능한가요?",
      content: "영화 시작 10분 전에 취소를 못했는데 혹시 환불 가능한 방법이 있는지 문의합니다.",
      status: "답변완료",
      createdAt: "2026-08-20",
      answerContent: "안녕하세요. 고객님, 영화 예매 취소 및 환불은 상영시간 20분 전까지만 홈페이지/앱을 통해 가능합니다. 상영 시작 이후에는 취소 및 환불이 불가능한 점 양해 부탁드립니다.",
    },
  ]);

  // 가상 FAQ 데이터
  const faqList: FAQItem[] = [
    {
      id: 1,
      category: "예매/결제",
      question: "예매 취소 및 환불 기준은 어떻게 되나요?",
      answer: "온라인 예매 취소는 영화 상영시간 20분 전까지 가능합니다. 상영 20분 전부터는 현장 창구에서만 취소 가능하며, 상영 시작 이후에는 취소가 불가합니다.",
    },
    {
      id: 2,
      category: "예매/결제",
      question: "신용카드 결제 승인 취소 후 환불까지 얼마나 걸리나요?",
      answer: "결제 취소 완료 후 카드사 반영까지는 영업일 기준 약 3~5일 정도 소요될 수 있습니다.",
    },
    {
      id: 3,
      category: "관람/좌석",
      question: "청소년 관람불가 영화 관람 시 신분증 확인을 하나요?",
      answer: "네, 청소년 관람불가 영화는 입장 시 실물 신분증(주민등록증, 운전면허증, 학생증 등) 확인을 진행합니다. 미소지 시 입장이 제한됩니다.",
    },
    {
      id: 4,
      category: "매점/쿠폰",
      question: "모바일에서 받은 모바일 팝콘/음료 쿠폰은 어떻게 사용하나요?",
      answer: "현장 키오스크 또는 매점 창구에서 바코드를 제시하시거나, 앱 내 콤보 즉시 주문(스마트오더) 시 쿠폰을 적용하여 사용하실 수 있습니다.",
    },
    {
      id: 5,
      category: "회원/기타",
      question: "비회원으로 예매한 내역은 어디서 확인하나요?",
      answer: "상단 메뉴의 '예매 확인' 또는 마이페이지에서 예매 당시 입력하신 이름, 휴대폰 번호, 비밀번호 4자리를 입력하시면 조회 가능합니다.",
    },
  ];

  const faqCategories = ["전체", "예매/결제", "관람/좌석", "매점/쿠폰", "회원/기타"];

  // 필터링된 FAQ
  const filteredFaqs = faqList.filter(
    (item) => faqCategory === "전체" || item.category === faqCategory
  );

  // 1:1 문의 제출 핸들러
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryTitle || !inquiryContent || !inquiryEmail) {
      alert("모든 필수 입력 사항을 작성해 주세요.");
      return;
    }

    const newInquiry: Inquiry = {
      id: Date.now(),
      category: inquiryCategory,
      title: inquiryTitle,
      content: inquiryContent,
      status: "답변대기",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMyInquiries([newInquiry, ...myInquiries]);
    setInquiryTitle("");
    setInquiryContent("");
    setInquiryEmail("");
    setInquiryPhone("");
    alert("1:1 문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.");
    setActiveTab("myInquiries");
  };

  return (
    <>
      <Menu />

      <div style={containerStyle}>
        <div style={innerStyle}>
          {/* 고객센터 헤더 */}
          <div style={headerStyle}>
            <h1 style={{ fontSize: "2.4rem", fontWeight: "bold", color: "#fff" }}>
              🎧 고객센터 & 문의하기
            </h1>
            <p style={{ color: "#aaa", marginTop: "8px", fontSize: "1rem" }}>
              궁금하신 점을 빠르게 해결해 드립니다.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div style={tabContainerStyle}>
            <button
              onClick={() => setActiveTab("faq")}
              style={{
                ...tabBtnStyle,
                borderBottom: activeTab === "faq" ? "3px solid #e50914" : "none",
                color: activeTab === "faq" ? "#fff" : "#888",
                fontWeight: activeTab === "faq" ? "bold" : "normal",
              }}
            >
              ❓ 자주 묻는 질문 (FAQ)
            </button>
            <button
              onClick={() => setActiveTab("inquiry")}
              style={{
                ...tabBtnStyle,
                borderBottom: activeTab === "inquiry" ? "3px solid #e50914" : "none",
                color: activeTab === "inquiry" ? "#fff" : "#888",
                fontWeight: activeTab === "inquiry" ? "bold" : "normal",
              }}
            >
              ✍️ 1:1 문의하기
            </button>
            <button
              onClick={() => setActiveTab("myInquiries")}
              style={{
                ...tabBtnStyle,
                borderBottom: activeTab === "myInquiries" ? "3px solid #e50914" : "none",
                color: activeTab === "myInquiries" ? "#fff" : "#888",
                fontWeight: activeTab === "myInquiries" ? "bold" : "normal",
              }}
            >
              📋 나의 문의 내역 ({myInquiries.length})
            </button>
          </div>

          {/* TAB 1: FAQ (자주 묻는 질문) */}
          {activeTab === "faq" && (
            <div>
              {/* 카테고리 필터 */}
              <div style={categoryBoxStyle}>
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategory(cat)}
                    style={{
                      ...catBtnStyle,
                      backgroundColor: faqCategory === cat ? "#e50914" : "#222228",
                      color: faqCategory === cat ? "#fff" : "#aaa",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* FAQ 아코디언 목록 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} style={faqItemStyle}>
                      <div
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        style={faqQuestionStyle}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={categoryBadgeStyle}>{faq.category}</span>
                          <span style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
                            {faq.question}
                          </span>
                        </div>
                        <span style={{ color: "#aaa" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                      {isOpen && (
                        <div style={faqAnswerStyle}>
                          <p style={{ lineHeight: "1.6", color: "#ddd" }}>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 1:1 문의 작성 */}
          {activeTab === "inquiry" && (
            <div style={formCardStyle}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "20px" }}>
                📝 1:1 문의 작성하기
              </h2>
              <form onSubmit={handleSubmitInquiry} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>문의 유형 *</label>
                  <select
                    value={inquiryCategory}
                    onChange={(e) => setInquiryCategory(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="예매/결제">예매/결제</option>
                    <option value="관람/좌석">관람/좌석</option>
                    <option value="매점/쿠폰">매점/쿠폰</option>
                    <option value="회원/기타">회원/기타</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>문의 제목 *</label>
                  <input
                    type="text"
                    placeholder="제목을 입력해주세요."
                    value={inquiryTitle}
                    onChange={(e) => setInquiryTitle(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>이메일 (답변 수신용) *</label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>연락처 (선택)</label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>문의 내용 *</label>
                  <textarea
                    rows={6}
                    placeholder="문의하실 내용을 상세히 적어주시면 빠른 답변에 도움이 됩니다."
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                    style={{ ...inputStyle, resize: "vertical" }}
                    required
                  />
                </div>

                <button type="submit" style={submitBtnStyle}>
                  문의 제출하기
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: 나의 문의 내역 */}
          {activeTab === "myInquiries" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {myInquiries.length > 0 ? (
                myInquiries.map((inq) => (
                  <div key={inq.id} style={inquiryCardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={categoryBadgeStyle}>{inq.category}</span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          color: inq.status === "답변완료" ? "#4caf50" : "#ff9800",
                        }}
                      >
                        ● {inq.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "6px" }}>
                      {inq.title}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "12px" }}>
                      작성일: {inq.createdAt}
                    </p>
                    <div style={{ backgroundColor: "#222228", padding: "12px", borderRadius: "8px", fontSize: "0.9rem", color: "#ccc" }}>
                      {inq.content}
                    </div>

                    {inq.answerContent && (
                      <div style={answerBoxStyle}>
                        <div style={{ fontWeight: "bold", color: "#e50914", marginBottom: "6px" }}>
                          💬 관리자 답변
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "#ddd", lineHeight: "1.5" }}>
                          {inq.answerContent}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={emptyStyle}>접수된 문의 내역이 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

// ===== 스타일 객체 모음 =====
const containerStyle: React.CSSProperties = {
  backgroundColor: "#0f0f12",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "sans-serif",
  paddingBottom: "80px",
};

const innerStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "40px 20px 0",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "30px",
};

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  borderBottom: "1px solid #2a2a30",
  marginBottom: "30px",
};

const tabBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  paddingBottom: "12px",
  fontSize: "1.05rem",
  cursor: "pointer",
};

const categoryBoxStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const catBtnStyle: React.CSSProperties = {
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "0.85rem",
  cursor: "pointer",
};

const faqItemStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  borderRadius: "10px",
  border: "1px solid #2a2a30",
  overflow: "hidden",
};

const faqQuestionStyle: React.CSSProperties = {
  padding: "16px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const faqAnswerStyle: React.CSSProperties = {
  padding: "16px 20px",
  backgroundColor: "#121215",
  borderTop: "1px solid #2a2a30",
};

const categoryBadgeStyle: React.CSSProperties = {
  backgroundColor: "#2a2a35",
  color: "#e50914",
  padding: "3px 8px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: "bold",
};

const formCardStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  padding: "28px",
  borderRadius: "16px",
  border: "1px solid #2a2a30",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  color: "#aaa",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#222228",
  border: "1px solid #3a3a42",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: "8px",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const submitBtnStyle: React.CSSProperties = {
  backgroundColor: "#e50914",
  color: "#fff",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};

const inquiryCardStyle: React.CSSProperties = {
  backgroundColor: "#18181c",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #2a2a30",
};

const answerBoxStyle: React.CSSProperties = {
  marginTop: "14px",
  backgroundColor: "#1a1012",
  border: "1px solid #3d1a1d",
  borderRadius: "8px",
  padding: "14px",
};

const emptyStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 0",
  color: "#666",
};