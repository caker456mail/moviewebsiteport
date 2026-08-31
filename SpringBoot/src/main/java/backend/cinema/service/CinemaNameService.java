package backend.cinema.service;

import backend.cinema.domain.Cinema;
import backend.cinema.repository.CinemaNameRepository;
import backend.movie.domain.Movie;
import backend.movie.repository.MovieRepository;
import backend.user.domain.User;
import backend.user.login.dto.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CinemaNameService{
    private final CinemaNameRepository cinemanameRepositiory;
    public List<Cinema> getCinemaName(){
        return  cinemanameRepositiory.findCinemanamerepository();
    }
}