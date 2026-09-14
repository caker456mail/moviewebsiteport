import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { z } from "zod";
import { FilterMainForm, SelectOption } from "@/feature/FilterConfig";

// ==========================================
// 1. Zod 스키마 (제출 검증 전용)
// ==========================================
export const bookingSchema = z
  .object({
    brand: z.string().min(1, "영화관 브랜드를 선택해주세요."),
    city: z.string().min(1, "시/도를 선택해주세요."),
    gu: z.string().min(1, "구/군을 선택해주세요."),
    branch: z.string().min(1, "상세 지점을 선택해주세요."),
    movieId: z.string().min(1, "관람할 영화를 선택해주세요."),
    time: z.string().min(1, "상영 시간을 선택해주세요."),
    adultCount: z.number().min(0),
    youthCount: z.number().min(0),
    seats: z.array(z.string()),
  })
  .refine((data) => data.adultCount + data.youthCount > 0, {
    message: "최소 1명 이상의 관람 인원을 지정해야 합니다.",
    path: ["adultCount"],
  })
  .refine((data) => data.seats.length === data.adultCount + data.youthCount, {
    message: "선택한 인원수와 좌석 수가 일치해야 합니다.",
    path: ["seats"],
  });

export type BookingFormData = z.infer<typeof bookingSchema>;

// UI 활성화 판별 순수 함수
export const validateStepAvailability = (data: Partial<BookingFormData>) => {
  const hasStep1 = Boolean(data.brand?.trim());
  const hasStep2 = hasStep1 && Boolean(data.city?.trim() && data.gu?.trim() && data.branch?.trim());
  const hasStep3 = hasStep2 && Boolean(data.movieId?.trim());
  const hasStep4 = hasStep3 && Boolean(data.time?.trim());

  const totalPeople = (data.adultCount || 0) + (data.youthCount || 0);
  const hasStep5 = hasStep4 && totalPeople > 0;
  const hasStep6 = hasStep5 && (data.seats?.length || 0) === totalPeople;

  return {
    canAccessStep1: true,
    canAccessStep2: hasStep1,
    canAccessStep3: hasStep2,
    canAccessStep4: hasStep3,
    canAccessStep5: hasStep4,
    canAccessStep6: hasStep5,
    isComplete: hasStep6,
  };
};

// ==========================================
// 2. 영화 검색용 Combobox
// ==========================================
interface MovieSearchSelectProps {
  options: SelectOption[];
  selectedValue?: string;
  disabled?: boolean;
  onSelect?: (val: string) => void;
}

const MovieSearchSelect = React.memo(({ options, selectedValue, disabled, onSelect }: MovieSearchSelectProps) => {
  const selectedItem = useMemo(() => options.find((opt) => opt.value === selectedValue), [options, selectedValue]);
  const [query, setQuery] = useState(selectedItem?.label ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedItem?.label ?? "");
  }, [selectedItem]);

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(trimmed));
  }, [options, query]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery(selectedItem?.label ?? "");
      }
    },
    [selectedItem]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, handleOutsideClick]);

  if (disabled) {
    return (
      <input
        type="text"
        disabled
        placeholder="이전 단계를 먼저 완료해주세요"
        className="cardform-select-common cardform-input-disabled"
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
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          className="cardform-select-common cardform-search-input"
          style={{
            borderColor: isOpen ? "#e50914" : "#33333d",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "12px",
            color: "#777",
            fontSize: "0.85rem",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
      </div>

      {isOpen && (
        <ul className="cardform-dropdown-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <li
                  key={opt.value}
                  onClick={() => {
                    setQuery(opt.label);
                    setIsOpen(false);
                    onSelect?.(opt.value);
                  }}
                  className="cardform-dropdown-item"
                  style={{
                    color: isSelected ? "#e50914" : "#ddd",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {opt.label}
                </li>
              );
            })
          ) : (
            <li style={{ padding: "10px 12px", fontSize: "0.8rem", color: "#666", textAlign: "center" }}>
              검색 결과가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
});

MovieSearchSelect.displayName = "MovieSearchSelect";

// ==========================================
// 3. CardForm 메인 컴포넌트 (반응형 적용)
// ==========================================
interface CardFormProps {
  filterconfig: FilterMainForm[];
  onChange?: (key: string, value: string) => void;
}

export const CardForm = ({ filterconfig, onChange }: CardFormProps) => {
  return (
    <section id="booking-panel" className="cardform-panel-wrapper">
      {/* 📱 5단계 필터 반응형 CSS */}
      <style>{`
        .cardform-panel-wrapper {
          width: 100%;
          background-color: #18181c;
          border-radius: 16px;
          border: 1px solid #2a2a30;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
          padding: 24px;
          box-sizing: border-box;
        }

        /* 데스크톱 기본: 5개 열 가로 분할 */
        .cardform-grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 1.4fr 1.4fr 1fr 1.2fr;
          gap: 20px;
          align-items: stretch;
        }

        .cardform-column {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #282830;
          padding-right: 20px;
          transition: opacity 0.2s ease;
        }

        .cardform-column.last-item {
          border-right: none;
          padding-right: 0;
        }

        /* 공통 input & select 디자인 */
        .cardform-select-common {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background-color: #222228;
          color: #fff;
          border: 1px solid #33333d;
          outline: none;
          font-size: 0.85rem;
          box-sizing: border-box;
          cursor: pointer;
        }

        .cardform-input-disabled {
          background-color: #1c1c22;
          color: #555;
          border: 1px solid #282830;
          cursor: not-allowed;
        }

        .cardform-search-input {
          padding-right: 32px;
        }

        .cardform-dropdown-list {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          max-height: 220px;
          overflow-y: auto;
          background-color: #1c1c22;
          border: 1px solid #33333d;
          border-radius: 8px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.6);
          list-style: none;
          padding: 4px 0;
          margin: 0;
          z-index: 100;
        }

        .cardform-dropdown-item {
          padding: 8px 12px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .cardform-dropdown-item:hover {
          background-color: #2b2b36;
        }

        /* 📱 태블릿 / 모바일 반응형 (1024px 이하 -> 세로 1열 전환) */
        @media (max-width: 1024px) {
          .cardform-panel-wrapper {
            padding: 18px;
          }

          .cardform-grid-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .cardform-column {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid #282830;
            padding-bottom: 16px;
          }

          .cardform-column.last-item {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>

      <form onSubmit={(e) => e.preventDefault()} className="cardform-grid-layout">
        {filterconfig.map((item, index) => {
          const isItemDisabled = Boolean(item.disabled);
          const isLast = index === filterconfig.length - 1;

          return (
            <div
              key={item.key}
              className={`cardform-column ${isLast ? "last-item" : ""}`}
              style={{
                opacity: isItemDisabled ? 0.3 : 1,
                pointerEvents: isItemDisabled ? "none" : "auto",
                userSelect: isItemDisabled ? "none" : "auto",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  color: isItemDisabled ? "#666" : "#e5e5e5",
                  fontWeight: "700",
                  marginBottom: "12px",
                  margin: "0 0 12px 0",
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
                    className="cardform-select-common"
                    style={{
                      cursor: isItemDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="">{isItemDisabled ? "이전 단계 필수" : "선택해주세요"}</option>
                    {item.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* 2) 3단계 지역 그룹 셀렉트 (2. 시/도, 구/군, 지점) */}
                {item.type === "group-select" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {item.fields?.map((field) => {
                      const isFieldDisabled = isItemDisabled || field.disabled;
                      return (
                        <div key={field.key}>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: isFieldDisabled ? "#555" : "#888",
                              display: "block",
                              marginBottom: "3px",
                            }}
                          >
                            {field.label}
                          </span>
                          <select
                            value={field.selectedValue || ""}
                            disabled={isFieldDisabled}
                            onChange={(e) => onChange?.(field.key, e.target.value)}
                            className="cardform-select-common"
                            style={{
                              opacity: isFieldDisabled ? 0.35 : 1,
                              cursor: isFieldDisabled ? "not-allowed" : "pointer",
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
                      );
                    })}
                  </div>
                )}

                {/* 3) 영화 검색형 셀렉트 (3. 영화 선택) */}
                {item.type === "searchable-select" && (
                  <MovieSearchSelect
                    options={item.options || []}
                    selectedValue={item.selectedValue}
                    disabled={isItemDisabled}
                    onSelect={(val) => onChange?.(item.key, val)}
                  />
                )}

                {/* 4) 인원 선택 커스텀 박스 (5. 인원수) */}
                {item.type === "custom" && (
                  <div
                    style={{
                      opacity: isItemDisabled ? 0.35 : 1,
                      pointerEvents: isItemDisabled ? "none" : "auto",
                    }}
                  >
                    {item.render?.()}
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