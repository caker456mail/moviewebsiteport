//package backend.movie.repository;
//
//import backend.movie.domain.Movie;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.List;
//
//public interface MovieRepository extends JpaRepository<Movie, Long> {
//    // SELECT * FROM movie WHERE title = ? 자동 생성
//    List<Movie> findByTitle(String title);
//}