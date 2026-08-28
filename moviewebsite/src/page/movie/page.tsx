import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 👈 react-router-dom의 Link 사용
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { fetchApi } from "@/service/apiConfig";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInfointerface } from "@/service/UserInfo";
interface moviesinterface {
  movieId: number;
  titleKr: string;
  titleEn: string;
  movieYear: number
  movieLocation: string;
  movieType: string;
  movieGenre: string;
  movieActive: string;
  movieDirector: string;
  movieCompany: string;
  imageUrl: string;
}
export default function Movie() {
  // const KEY = "56fb86dc71df6fd10f48f977e78a5720";
  const [movies, setMovies] = useState<moviesinterface[]>([]);
  const [users, setUsers] = useState<UserInfointerface | null>(null);
  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await fetchApi("/movies.do", { method: "GET" })
        setMovies(response as moviesinterface[]);

      } catch (error) {
        console.error("에러 발생:", error);
      }
    };
    const userData = localStorage.getItem("user");
    if (userData) {
      setUsers(JSON.parse(userData));
    }
    getMovie();
  }, []);
  useEffect(() => {
    console.log(users);

  }, [users])
  const truncateText = (str: string | undefined | null, maxLength: number = 10): string => {
    if (!str) return "미정"; // 데이터가 없거나 null/undefined인 경우
    if (str.length <= maxLength) return str;

    return str.slice(0, maxLength) + "...";
  };
  return (
    <>
      <Menu />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <h2
          style={{
            margin: "25px 0 0 50px",
            textAlign: "left",
            color: "#FFF",
            fontSize: "1.8rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              width: "4px",
              height: "24px",
              backgroundColor: "#e50914",
              borderRadius: "2px",
            }}
          ></span>
          2026 상영작


        </h2>
        {
          users?.userRole === "ADMIN" ?
            (<div style={{ textAlign: "right", margin: "25px 50px 0 0" }}>
              <Button
                title="영화추가(관리자전용)"
                isSelected={true} />
            </div>) : ""
        }

      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", padding: "20px" }}>
        {movies.map((movie) => (
          <Link
            key={movie.movieId}
            to={`/movie/info/${movie.movieId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              key={movie.movieId}
              title={truncateText(movie.titleEn ? movie.titleKr + `(${movie.titleEn})` : movie.titleKr, 10)}
              image={movie.imageUrl}
              TEXTInfo={
                <>
                  <p title={movie.movieGenre}>
                    장르 : {truncateText(movie.movieGenre, 7)}
                  </p>
                  <p title={movie.movieDirector}>
                    감독 : {truncateText(movie.movieDirector, 5)}
                  </p>
                  <p title={movie.movieCompany}>
                    제작사 : {truncateText(movie.movieCompany, 5)}
                  </p>
                </>
              }
            />
          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
}
