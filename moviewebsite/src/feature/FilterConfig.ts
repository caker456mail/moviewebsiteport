  import React from "react";
  import { CinemaItem } from "@/service/CinemaName";

  export interface SelectOption {
    value: string;
    label: string;
  }

  export interface SubSelectField {
    key: string;
    label: string;
    placeholder: string;
    selectedValue: string;
    options: SelectOption[];
    disabled?: boolean;
  }

  export interface FilterMainForm {
    key: string;
    name: string;
    type: "select" | "group-select" | "searchable-select" | "custom";
    options?: SelectOption[];
    selectedValue?: string;
    fields?: SubSelectField[];
    disabled?: boolean;
    render?: () => React.ReactNode;
  }

  // 1. 단순 문자열 배열 -> Option 변환 유틸
  const toOptions = (list: string[]): SelectOption[] =>
    list.map((item) => ({ value: item, label: item }));

  // 2. Props 그룹화로 MainPage 매개변수 부담 최소화
  export interface FilterFormProps {
    sourceData: {
      cinemas: CinemaItem[];
      cityList: string[];
      guList: string[];
      branchList: string[];
      movies: { id: number; title: string }[];
      timeSlots: string[];
    };
    selectedValues: {
      cinema: string;
      city: string;
      gu: string;
      branch: string;
      movie: string;
      time: string;
    };
    stepPermissions: {
      canAccessStep1: boolean;
      canAccessStep2: boolean;
      canAccessStep3: boolean;
      canAccessStep4: boolean;
      canAccessStep5: boolean;
    };
    renderPeople: () => React.ReactNode;
  }

  export const getFilterMainForm = ({
    sourceData,
    selectedValues,
    stepPermissions,
    renderPeople,
  }: FilterFormProps): FilterMainForm[] => {
    const { cinemas, cityList, guList, branchList, movies, timeSlots } = sourceData;
    const { cinema, city, gu, branch, movie, time } = selectedValues;

    const canStep2 = stepPermissions.canAccessStep2;

    return [
      {
        key: "brand",
        name: "🍿 1. 영화관 브랜드",
        type: "select",
        selectedValue: cinema,
        disabled: !stepPermissions.canAccessStep1,
        options: cinemas
          .filter((item) => item.cinemaName !== "더보기")
          .map((item) => ({ value: item.cinemaName, label: item.cinemaName })),
      },
      {
        key: "location",
        name: "📍 2. 지역 선택",
        type: "group-select",
        disabled: !canStep2,
        fields: [
          {
            key: "city",
            label: "시 / 도",
            placeholder: canStep2 ? "시/도 선택" : "1단계 선행 필수",
            selectedValue: city,
            options: toOptions(cityList),
            disabled: !canStep2,
          },
          {
            key: "gu",
            label: "구 / 군",
            placeholder: city ? "구/군 선택" : "시/도 선택 필수",
            selectedValue: gu,
            options: toOptions(guList),
            disabled: !canStep2 || !city,
          },
          {
            key: "branch",
            label: "상세 지점",
            placeholder: gu ? "지점 선택" : "구/군 선택 필수",
            selectedValue: branch,
            options: toOptions(branchList),
            disabled: !canStep2 || !gu,
          },
        ],
      },
      {
        key: "movie",
        name: "🎬 3. 영화 선택",
        type: "searchable-select",
        selectedValue: movie,
        disabled: !stepPermissions.canAccessStep3,
        options: movies.map((m) => ({
          value: String(m.id),
          label: m.title,
        })),
      },
      {
        key: "time",
        name: "⏰ 4. 시간 선택",
        type: "select",
        selectedValue: time,
        disabled: !stepPermissions.canAccessStep4,
        options: toOptions(timeSlots),
      },
      {
        key: "people",
        name: "👥 5. 인원수",
        type: "custom",
        disabled: !stepPermissions.canAccessStep5,
        render: renderPeople,
      },
    ];
  };