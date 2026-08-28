package backend.movie.service;

import backend.movie.domain.Movie;
import backend.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    public List<Movie> getMovies(){
        return movieRepository.findbymovierepository();
    }
}
