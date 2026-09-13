import React, { useState, useRef, useEffect, useMemo } from "react";
import { z } from "zod";
import { FilterMainForm, SelectOption } from "@/feature/FilterConfig";

// ==========================================
// 1. Zod 순차적 직렬 검증 함수 (앞 단계 미통과 시 무조건 차단)
// ==========================================
export const bookingSchema = z
  .object({
    brand: z.string().min(1, "1. 영화관 브랜드를 선택해주세요."),
    city: z.string().min(1, "2. 시/도를 선택해주세요."),
    gu: z.string().min(1, "2. 구/군을 선택해주세요."),
    branch: z.string().min(1, "2. 상세 지점을 선택해주세요."),
    movieId: z.string().min(1, "3. 관람할 영화를 선택해주세요."),
    time: z.string().min(1, "4. 상영 시간을 선택해주세요."),
    adultCount: z.number().min(0),
    youthCount: z.number().min(0),
    seats: z.array(z.string()),
  })
  .refine((data) => data.adultCount + data.youthCount > 0, {
    message: "5. 최소 1명 이상의 관람 인원을 지정해야 합니다.",
    path: ["adultCount"],
  })
  .refine((data) => data.seats.length === data.adultCount + data.youthCount, {
    message: "6. 선택한 인원수와 좌석 수가 일치해야 합니다.",
    path: ["seats"],
  });

export type BookingFormData = z.infer<typeof bookingSchema>;

export const validateStepAvailability = (data: Partial<BookingFormData>) => {
  // 1단계 통과 여부
  const step1 = z.string().min(1).safeParse(data.brand).success;

  // 2단계 통과 여부: 1단계 완료 AND 지역 3단계 모두 선택
  const step2 =
    step1 &&
    z.string().min(1).safeParse(data.city).success &&
    z.string().min(1).safeParse(data.gu).success &&
    z.string().min(1).safeParse(data.branch).success;

  // 3단계 통과 여부: 2단계 완료 AND 영화 선택
  const step3 = step2 && z.string().min(1).safeParse(data.movieId).success;

  // 4단계 통과 여부: 3단계 완료 AND 시간 선택
  const step4 = step3 && z.string().min(1).safeParse(data.time).success;

  // 5단계 통과 여부: 4단계 완료 AND 1명 이상 인원 설정
  const step5 = step4 && (data.adultCount || 0) + (data.youthCount || 0) > 0;

  // 6단계 완료 여부: 5단계 완료 AND 선택 좌석 수 === 인원수
  const step6 =
    step5 &&
    (data.seats?.length || 0) === (data.adultCount || 0) + (data.youthCount || 0) &&
    (data.seats?.length || 0) > 0;

  return {
    canAccessStep1: true,
    canAccessStep2: step1, // 1단계 안 끝나면 2단계 비활성화
    canAccessStep3: step2, // 2단계 안 끝나면 3단계 비활성화
    canAccessStep4: step3, // 3단계 안 끝나면 4단계 비활성화
    canAccessStep5: step4, // 4단계 안 끝나면 5단계 비활성화
    canAccessStep6: step5, // 5단계 안 끝나면 6단계 비활성화
    isComplete: step6,
  };
};

// ==========================================
// 2. 3번 영화 검색용 Combobox
// ==========================================
interface MovieSearchSelectProps {
  options: SelectOption[];
  selectedValue?: string;
  disabled?: boolean;
  onSelect?: (val: string) => void;
}

const MovieSearchSelect = ({
  options,
  selectedValue,
  disabled,
  onSelect,
}: MovieSearchSelectProps) => {
  const selectedItem = options.find((opt) => opt.value === selectedValue);
  const [query, setQuery] = useState(selectedItem ? selectedItem.label : "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedItem ? selectedItem.label : "");
  }, [selectedItem]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (selectedItem) setQuery(selectedItem.label);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedItem]);

  if (disabled) {
    return (
      <input
        type="text"
        disabled
        placeholder="이전 단계를 먼저 완료해주세요"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          backgroundColor: "#1c1c22",
          color: "#555",
          border: "1px solid #282830",
          fontSize: "0.85rem",
          cursor: "not-allowed",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={query}
          placeholder="영화명을 검색하세요"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          style={{
            width: "100%",
            padding: "10px 32px 10px 12px",
            borderRadius: "8px",
            backgroundColor: "#222228",
            color: "#fff",
            border: isOpen ? "1px solid #e50914" : "1px solid #33333d",
            outline: "none",
            fontSize: "0.85rem",
            boxSizing: "border-box",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "10px",
            color: "#777",
            fontSize: "0.8rem",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
      </div>

      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width: "100%",
            maxHeight: "220px",
            overflowY: "auto",
            backgroundColor: "#1c1c22",
            border: "1px solid #33333d",
            borderRadius: "8px",
            boxShadow: "0 10px 24px rgba(0,0,0,0.6)",
            listStyle: "none",
            padding: "4px 0",
            margin: 0,
            zIndex: 100,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  setQuery(opt.label);
                  setIsOpen(false);
                  onSelect?.(opt.value);
                }}
                style={{
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  color: opt.value === selectedValue ? "#e50914" : "#ddd",
                  fontWeight: opt.value === selectedValue ? "bold" : "normal",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2b2b36")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li
              style={{
                padding: "10px 12px",
                fontSize: "0.8rem",
                color: "#666",
                textAlign: "center",
              }}
            >
              검색 결과가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

// ==========================================
// 3. CardForm 메인 컴포넌트
// ==========================================
interface CardFormProps {
  filterconfig: FilterMainForm[];
  onChange?: (key: string, value: string) => void;
}

export const CardForm = ({ filterconfig, onChange }: CardFormProps) => {
  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#222228",
    color: "#fff",
    border: "1px solid #33333d",
    outline: "none",
    fontSize: "0.85rem",
    cursor: "pointer",
  };

  return (
    <section
      id="booking-panel"
      style={{
        width: "100%",
        backgroundColor: "#18181c",
        borderRadius: "16px",
        border: "1px solid #2a2a30",
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.4fr 1.4fr 1fr 1.2fr",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {filterconfig.map((item, index) => {
          const isItemDisabled = Boolean(item.disabled);

          return (
            <div
              key={item.key}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight:
                  index !== filterconfig.length - 1 ? "1px solid #282830" : "none",
                paddingRight:
                  index !== filterconfig.length - 1 ? "20px" : "0",
                opacity: isItemDisabled ? 0.3 : 1,
                pointerEvents: isItemDisabled ? "none" : "auto", // 비활성화 시 클릭 완전 차단
                userSelect: isItemDisabled ? "none" : "auto",
                transition: "opacity 0.2s ease",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  color: isItemDisabled ? "#666" : "#e5e5e5",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                {item.name}
              </h3>

              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* 1) 일반 셀렉트 (1. 브랜드, 4. 시간) */}
                {item.type === "select" && (
                  <select
                    value={item.selectedValue || ""}
                    disabled={isItemDisabled}
                    onChange={(e) => onChange?.(item.key, e.target.value)}
                    style={{
                      ...selectStyle,
                      cursor: isItemDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="">
                      {isItemDisabled ? "이전 단계 필수" : "선택해주세요"}
                    </option>
                    {item.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* 2) 3단계 지역 셀렉트 */}
                {item.type === "group-select" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {item.fields?.map((field) => (
                      <div key={field.key}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: isItemDisabled ? "#555" : "#888",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          {field.label}
                        </span>
                        <select
                          value={field.selectedValue || ""}
                          disabled={isItemDisabled || field.disabled}
                          onChange={(e) => onChange?.(field.key, e.target.value)}
                          style={{
                            ...selectStyle,
                            opacity: isItemDisabled || field.disabled ? 0.35 : 1,
                            cursor:
                              isItemDisabled || field.disabled ? "not-allowed" : "pointer",
                          }}
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3) 영화 검색형 셀렉트 */}
                {item.type === "searchable-select" && (
                  <MovieSearchSelect
                    options={item.options || []}
                    selectedValue={item.selectedValue}
                    disabled={isItemDisabled}
                    onSelect={(val) => onChange?.(item.key, val)}
                  />
                )}

                {/* 4) 5단계 인원수 커스텀 (잠금 상태 시 터치 차단 박스) */}
                {item.type === "custom" && (
                  <div
                    style={{
                      opacity: isItemDisabled ? 0.35 : 1,
                      pointerEvents: isItemDisabled ? "none" : "auto",
                    }}
                  >
                    {item.render && item.render()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </form>
    </section>
  );
};