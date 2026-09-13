import { fetchApi } from "./apiConfig";

export interface CinemaItem {
  cinemaId: number;
  cinemaSite: string;
  cinemaName: string;
  cinemaImg?: string;
}

export const CinemaName = async (): Promise<CinemaItem[]> => {
  try {
    const response = await fetchApi<CinemaItem[]>("/cinemalist.do", {
      method: "GET",
    });

    console.log(response, "이름");
    return (response as CinemaItem[]) || [];
  } catch (error) {
    console.error("에러 발생:", error);
    return []; // 에러 시 빈 배열을 반환하여 undefined/객체 할당 방지
  }
};