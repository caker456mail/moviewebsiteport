package backend.movie.repository;

import backend.movie.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie,Long> {
    @Query(value = """
    SELECT * FROM admin.movies
""",nativeQuery = true)
    List<Movie> findbymovierepository();
}
