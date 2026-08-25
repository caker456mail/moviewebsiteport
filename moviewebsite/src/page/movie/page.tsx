"use client";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

export default function Movie() {
    const KEY = "56fb86dc71df6fd10f48f977e78a5720";
    // apidata는 객체이므로 초기값은 null로 주고, 영화 목록만 배열로 다루는 것이 편리합니다.
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=ko-KR&page=1`
                );
                const data = await response.json();
                // data 전체 대신 data.results(영화 배열)만 상태에 저장
                setMovies(data.results || []);
                console.log(data.results);
            } catch (error) {
                console.error("에러 발생:", error);
            }
        };

        getMovie();
    }, []);

    return (
        <>
            <Menu />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", padding: "20px" }}>
                {movies.map((movie) => (
                    <div>

                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: "100%", borderRadius: "8px" }}
                            />
                        )}
                        <h3 style={{ fontSize: "16px", marginTop: "8px" }}>{movie.title}</h3>
                        <p style={{ fontSize: "14px", color: "#666" }}>평점: ⭐ {movie.vote_average}</p>
                    </div>


                ))}
            </div>
            <Footer />
        </>

    );
}