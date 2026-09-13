export interface BackendMovie {
  id: number;
  tmdbId: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  status?: string;
}

// MainPage에서 사용하는 MovieType 형태로 변환
export const getMovies = async (): Promise<BackendMovie[]> => {
  const response = await fetch("http://localhost:8080/movies.do"); // 백엔드 포트에 맞게 조정
  if (!response.ok) {
    throw new Error(`영화 목록 조회 실패: ${response.status}`);
  }
  return response.json();
};