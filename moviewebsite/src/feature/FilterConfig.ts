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

interface FilterFormProps {
  cinemas: CinemaItem[];
  cityList: string[];
  guList: string[];
  branchList: string[];
  nowPlayingMovies: { id: number; title: string }[];
  timeSlots: string[];
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
    canAccessStep6: boolean;
  };
  renderPeople: () => React.ReactNode;
}

export const getFilterMainForm = ({
  cinemas,
  cityList,
  guList,
  branchList,
  nowPlayingMovies,
  timeSlots,
  selectedValues,
  stepPermissions,
  renderPeople,
}: FilterFormProps): FilterMainForm[] => [
  {
    key: "brand",
    name: "🍿 1. 영화관 브랜드",
    type: "select",
    selectedValue: selectedValues.cinema,
    disabled: !stepPermissions.canAccessStep1,
    options: cinemas
      .filter((item) => item.cinemaName !== "더보기")
      .map((item) => ({
        value: item.cinemaName,
        label: item.cinemaName,
      })),
  },
  {
    key: "location",
    name: "📍 2. 지역 선택",
    type: "group-select",
    disabled: !stepPermissions.canAccessStep2, // 1단계 미완료 시 2단계 통째로 잠금
    fields: [
      {
        key: "city",
        label: "시 / 도",
        placeholder: stepPermissions.canAccessStep2 ? "시/도 선택" : "1단계 선행 필수",
        selectedValue: selectedValues.city,
        options: cityList.map((city) => ({ value: city, label: city })),
        disabled: !stepPermissions.canAccessStep2,
      },
      {
        key: "gu",
        label: "구 / 군",
        placeholder: selectedValues.city ? "구/군 선택" : "시/도 선택 필수",
        selectedValue: selectedValues.gu,
        options: guList.map((gu) => ({ value: gu, label: gu })),
        disabled: !stepPermissions.canAccessStep2 || !selectedValues.city,
      },
      {
        key: "branch",
        label: "상세 지점",
        placeholder: selectedValues.gu ? "지점 선택" : "구/군 선택 필수",
        selectedValue: selectedValues.branch,
        options: branchList.map((branch) => ({ value: branch, label: branch })),
        disabled: !stepPermissions.canAccessStep2 || !selectedValues.gu,
      },
    ],
  },
  {
    key: "movie",
    name: "🎬 3. 영화 선택",
    type: "searchable-select",
    selectedValue: selectedValues.movie,
    disabled: !stepPermissions.canAccessStep3, // 2단계 미완료 시 3단계 잠금
    options: nowPlayingMovies.map((movie) => ({
      value: String(movie.id),
      label: movie.title,
    })),
  },
  {
    key: "time",
    name: "⏰ 4. 시간 선택",
    type: "select",
    selectedValue: selectedValues.time,
    disabled: !stepPermissions.canAccessStep4, // 3단계 미완료 시 4단계 잠금
    options: timeSlots.map((time) => ({
      value: time,
      label: time,
    })),
  },
  {
    key: "people",
    name: "👥 5. 인원수",
    type: "custom",
    disabled: !stepPermissions.canAccessStep5, // 4단계 미완료 시 5단계 잠금
    render: renderPeople,
  },
];