const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const NO_IMAGE_URL = "https://via.placeholder.com/500x750?text=No+Image";

// 백엔드 원본 DTO
export interface BackendMovie {
  id: number;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string;
  poster_path?: string; // 혹시 모를 스네이크 케이스 대비
  backdropPath?: string;
  backdrop_path?: string;
  releaseDate?: string;
  release_date?: string;
  voteAverage?: number;
  vote_average?: number;
  voteCount?: number;
  status?: string;
}

// 프론트엔드 UI 컴포넌트가 바로 사용할 완성형 Movie 모델
export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  voteAverage: string; // toFixed(1) 처리 완료된 문자열
  releaseDate: string;
}

// 서비스 내부 정규화 함수
const normalizeMovie = (item: BackendMovie): Movie => {
  const poster = item.posterPath || item.poster_path;
  const backdrop = item.backdropPath || item.backdrop_path;
  const vote = item.voteAverage ?? item.vote_average ?? 0;

  return {
    id: item.id,
    title: item.title,
    overview: item.overview || "",
    posterUrl: poster ? `${TMDB_IMAGE_BASE_URL}${poster}` : NO_IMAGE_URL,
    backdropUrl: backdrop ? `${TMDB_IMAGE_BASE_URL}${backdrop}` : NO_IMAGE_URL,
    voteAverage: Number(vote).toFixed(1),
    releaseDate: item.releaseDate || item.release_date || "미정",
  };
};

export const getMovies = async (): Promise<Movie[]> => {
  const response = await fetch("/movies.do");
  if (!response.ok) {
    throw new Error(`영화 목록 조회 실패: ${response.status}`);
   
  }
  const rawList: BackendMovie[] = await response.json();
  return rawList.map(normalizeMovie);
};