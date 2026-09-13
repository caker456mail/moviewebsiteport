package backend.Api.TMDB.repository;

import backend.Api.TMDB.domain.TmdbMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TmdbMovieRepository extends JpaRepository<TmdbMovie, Long> {

    Optional<TmdbMovie> findByTmdbId(Long tmdbId);

    @Modifying
    @Query(value = """
        INSERT INTO admin.movies (
            tmdb_id, title, original_title, overview, 
            poster_path, backdrop_path, release_date, 
            vote_average, vote_count, status, created_at, updated_at
        ) VALUES (
            :#{#movie.tmdbId}, :#{#movie.title}, :#{#movie.originalTitle}, :#{#movie.overview},
            :#{#movie.posterPath}, :#{#movie.backdropPath}, :#{#movie.releaseDate},
            :#{#movie.voteAverage}, :#{#movie.voteCount}, :#{#movie.status},
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (tmdb_id) DO UPDATE SET
            title = EXCLUDED.title,
            original_title = EXCLUDED.original_title,
            overview = EXCLUDED.overview,
            poster_path = EXCLUDED.poster_path,
            backdrop_path = EXCLUDED.backdrop_path,
            release_date = EXCLUDED.release_date,
            vote_average = EXCLUDED.vote_average,
            vote_count = EXCLUDED.vote_count,
            status = EXCLUDED.status,
            updated_at = CURRENT_TIMESTAMP
    """, nativeQuery = true)
    void upsert(@Param("movie") TmdbMovie movie);
}