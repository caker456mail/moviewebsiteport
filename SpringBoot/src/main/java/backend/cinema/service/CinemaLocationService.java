package backend.cinema.service;

import backend.cinema.domain.Cinema;
import backend.cinema.repository.CinemaLocationRepository;
import backend.cinema.repository.CinemaNameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CinemaLocationService{
    private final CinemaLocationRepository cinemaLocationRepository;
    public List<Cinema> getCinemaLoctions(String cinemaName){
        return cinemaLocationRepository.findbycinemalocation(cinemaName);
    }
}