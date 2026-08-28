package backend.movie.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@Table(schema = "admin", name = "movies")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "movie_id")
    private UUID movieId;

    @Column(name = "title_kr", length = 255)
    private String titleKr;

    @Column(name = "title_en", length = 255)
    private String titleEn;

    @Column(name = "movie_year")
    private Integer movieYear;

    @Column(name = "movie_location", length = 50)
    private String movieLocation;

    @Column(name = "movie_type", length = 50)
    private String movieType;

    @Column(name = "movie_genre", length = 100)
    private String movieGenre;

    @Column(name = "movie_active", length = 25)
    private String movieActive;

    @Column(name = "movie_director", length = 255)
    private String movieDirector;

    @Column(name = "movie_company", length = 100)
    private String movieCompany;

    @Column(name = "image_url", length = 255)
    private String imageUrl;
}