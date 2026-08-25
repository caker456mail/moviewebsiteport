

export const Movie = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=ko-KR&page=1`
    );
    const data = await response.json();
    // data 전체 대신 data.results(영화 배열)만 상태에 저장
    setMovies(data.results || []);
    console.log(data.results, "광녀두두둗두");
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
