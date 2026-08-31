package backend.cinema.controller;

import backend.cinema.domain.Cinema;
import backend.cinema.dto.CinemaLocationDto;
import backend.cinema.repository.CinemaNameRepository;
import backend.cinema.service.CinemaLocationService;
import backend.cinema.service.CinemaNameService;
import backend.movie.domain.Movie;
import backend.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*" )
public class CinemaController {
    private final CinemaNameService cinemaService;
    private final CinemaLocationService cinemaLocationService;

    @GetMapping("/cinemalist.do")
    public ResponseEntity<List<Cinema>> getCinemaNames() {
        List<Cinema> cinemas = cinemaService.getCinemaName();
        return ResponseEntity.ok(cinemas);
    }
    @PostMapping("/cinemalocation.do")
    public  ResponseEntity<List<Cinema>> getCinemaLocations(@RequestBody CinemaLocationDto requestdto){
        String cinemaname = requestdto.getCinemaName();
        List<Cinema> resultList = cinemaLocationService.getCinemaLoctions(cinemaname);
        return ResponseEntity.ok(resultList);
    }
}
