package backend.Api.TMDB.dto;

import backend.Api.TMDB.domain.TmdbMovie;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TmdbMovieDto {

    @Getter
    @NoArgsConstructor
    public static class Response {
        private int page;
        private List<MovieItem> results;

        @JsonProperty("total_pages")
        private int totalPages;

        @JsonProperty("total_results")
        private int totalResults;
    }

    @Getter
    @NoArgsConstructor
    public static class MovieItem {
        private Long id; // TMDB의 고유 ID (tmdb_id 매핑)
        private String title;

        @JsonProperty("original_title")
        private String originalTitle;

        private String overview;

        @JsonProperty("poster_path")
        private String posterPath;

        @JsonProperty("backdrop_path")
        private String backdropPath;

        @JsonProperty("release_date")
        private String releaseDate;

        @JsonProperty("vote_average")
        private BigDecimal voteAverage;

        @JsonProperty("vote_count")
        private Integer voteCount;

        // DTO -> TmdbMovie Entity 변환
        public TmdbMovie toEntity(String status) {
            LocalDate parsedDate = null;
            if (this.releaseDate != null && !this.releaseDate.isBlank()) {
                parsedDate = LocalDate.parse(this.releaseDate);
            }

            return TmdbMovie.builder()
                    .tmdbId(this.id)
                    .title(this.title)
                    .originalTitle(this.originalTitle)
                    .overview(this.overview)
                    .posterPath(this.posterPath)
                    .backdropPath(this.backdropPath)
                    .releaseDate(parsedDate)
                    .voteAverage(this.voteAverage)
                    .voteCount(this.voteCount)
                    .status(status)
                    .build();
        }
    }
}