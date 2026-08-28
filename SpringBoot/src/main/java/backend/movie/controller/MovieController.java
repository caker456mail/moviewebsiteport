package backend.movie.controller;

import backend.movie.domain.Movie;
import backend.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin( origins = "http://localhost:5173", allowedHeaders = "*" )
public class MovieController {
    private final MovieService movieService;
    @GetMapping("/movies.do")
    public ResponseEntity<List<Movie>> getAllMovies() {
        List<Movie> movies = movieService.getMovies();
        return ResponseEntity.ok(movies); // JSON 형태로 프론트에 반환
    }
}
