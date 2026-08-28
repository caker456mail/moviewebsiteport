import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

// 댓글 타입 정의
interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

export default function MovieInfo() {
  const KEY = "56fb86dc71df6fd10f48f977e78a5720";
  const { id } = useParams();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 리뷰 관련 상태값
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  // 페이지네이션 상태값
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // 1. 영화 정보 불러오기 & 해당 영화의 댓글 가져오기
  useEffect(() => {
    if (!id) return;

    const getMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=ko-KR`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("상세 정보 불러오기 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovieDetail();

    // 영화 ID별로 로컬 스토리지에서 리뷰 읽기
    const savedReviews = localStorage.getItem(`reviews_movie_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [id]);

  // 2. 리뷰 작성 핸들러
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      alert("작성자와 리뷰 내용을 입력해주세요.");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      author,
      rating: Number(rating),
      content,
      createdAt: new Date().toLocaleDateString("ko-KR"),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // 로컬 스토리지 저장
    localStorage.setItem(`reviews_movie_${id}`, JSON.stringify(updatedReviews));

    // 입력 폼 초기화 및 1페이지로 이동
    setAuthor("");
    setContent("");
    setRating(5);
    setCurrentPage(1);
  };

  // 3. 리뷰 삭제 핸들러
  const handleDeleteReview = (reviewId: number) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_movie_${id}`, JSON.stringify(updatedReviews));
  };

  // 4. 페이지네이션 계산
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  if (loading) return <div style={{ color: "#fff", padding: "50px", textAlign: "center" }}>로딩 중...</div>;
  if (!movie) return <div style={{ color: "#fff", padding: "50px", textAlign: "center" }}>영화 정보가 없습니다.</div>;

  return (
    <>
      <Menu />
      <div style={{ backgroundColor: "#0f0f12", color: "#fff", minHeight: "100vh", padding: "40px 20px" }}>
        {/* 영화 상세 정보 */}
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: "280px", borderRadius: "12px" }}
          />

          <div style={{ flex: "1", minWidth: "280px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>{movie.title}</h1>
            <p style={{ color: "#aaa", marginBottom: "16px" }}>
              개봉일: {movie.release_date} | 러닝타임: {movie.runtime}분 | 평점: ⭐ {movie.vote_average}
            </p>

            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px" }}>줄거리</h3>
            <p style={{ lineHeight: "1.6", color: "#ddd" }}>
              {movie.overview || "등록된 줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>

        {/* 댓글/리뷰 섹션 */}
        <div style={{ maxWidth: "900px", margin: "50px auto 0" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
            💬 실시간 관람평 ({reviews.length})
          </h2>

          {/* 리뷰 작성 폼 */}
          <form onSubmit={handleAddReview} style={{ backgroundColor: "#18181c", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="작성자 닉네임"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{ backgroundColor: "#222", border: "1px solid #444", color: "#fff", padding: "8px 12px", borderRadius: "6px", flex: "1" }}
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ backgroundColor: "#222", border: "1px solid #444", color: "#fff", padding: "8px 12px", borderRadius: "6px" }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5점)</option>
                <option value={4}>⭐⭐⭐⭐ (4점)</option>
                <option value={3}>⭐⭐⭐ (3점)</option>
                <option value={2}>⭐⭐ (2점)</option>
                <option value={1}>⭐ (1점)</option>
              </select>
            </div>
            <textarea
              placeholder="영화에 대한 후기를 자유롭게 남겨주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: "100%", height: "80px", backgroundColor: "#222", border: "1px solid #444", color: "#fff", padding: "10px", borderRadius: "6px", resize: "none", boxSizing: "border-box", marginBottom: "10px" }}
            />
            <button
              type="submit"
              style={{ backgroundColor: "#e50914", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", float: "right" }}
            >
              관람평 등록
            </button>
            <div style={{ clear: "both" }} />
          </form>

          {/* 리뷰 목록 */}
          {currentReviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentReviews.map((rev) => (
                <div key={rev.id} style={{ backgroundColor: "#18181c", padding: "16px", borderRadius: "8px", border: "1px solid #2a2a30" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "bold", color: "#fff" }}>{rev.author}</span>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{ color: "#ffc107", fontSize: "0.9rem" }}>{"⭐".repeat(rev.rating)}</span>
                      <span style={{ color: "#666", fontSize: "0.8rem" }}>{rev.createdAt}</span>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "0.8rem" }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p style={{ color: "#ddd", fontSize: "0.95rem", lineHeight: "1.4" }}>{rev.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#666", padding: "40px 0" }}>
              아직 등록된 관람평이 없습니다. 첫 번째 관람평을 남겨보세요!
            </div>
          )}

          {/* 페이지네이션 버튼 (5개 넘어가면 표시) */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "30px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    backgroundColor: currentPage === pageNum ? "#e50914" : "#222",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: currentPage === pageNum ? "bold" : "normal",
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}   