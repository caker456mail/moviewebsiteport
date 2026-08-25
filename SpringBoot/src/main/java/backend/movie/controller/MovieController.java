//package backend.movie.controller;
//
//import backend.movie.domain.Movie;
//import backend.movie.repository.MovieRepository;
//import backend.movie.dto.MovieRequestDto;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/movies")
//@CrossOrigin(origins = "http://localhost:3000") // 리액트 주소 허용 (CORS 해결)
//public class MovieController {
//
//    private final MovieRepository movieRepository;
//
//    public MovieController(MovieRepository movieRepository) {
//        this.movieRepository = movieRepository;
//    }
//
//    @PostMapping("/search")
//    public List<Movie> searchMovie(@RequestBody MovieRequestDto request) {
//        // 프론트에서 넘어온 title로 DB 검색 후 결과를 JSON으로 리턴
//        return movieRepository.findByTitle(request.getTitle());
//    }
//}