import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 👈 react-router-dom의 Link 사용
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import { fetchApi } from "@/service/apiConfig";
import { Card } from "@/components/custom/Card";
import { Button } from "@/components/ui/Button";
import { UserInfointerface } from "@/service/UserInfo";
interface moviesinterface {
  backdropPath: string;
  createdAt: string;
  id: number;
  originalTitle: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  status: string;
  title: string;
  tmdbId: number;
  updatedAt: string;
  voteAverage: number;
  voteCount: number;
}



export default function Movie() {

  const [movies, setMovies] = useState<moviesinterface[]>([]);
  const [users, setUsers] = useState<UserInfointerface | null>(null);
  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await fetchApi("/movies.do", { method: "GET" })
        console.log(response);
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
            key={movie.id}
            to={`/movie/info/${movie.tmdbId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              key={movie.id}
              title={truncateText(movie.originalTitle
                ? movie.title + `(${movie.originalTitle})` : movie.title, 10)}
              image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              
            />
          </Link>
        ))}
      </div>
    </>
  );
}
