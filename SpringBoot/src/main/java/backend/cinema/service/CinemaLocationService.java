package backend.cinema.service;

import backend.cinema.domain.Cinema;
import backend.cinema.dto.CinemaLocationResponseDto;
import backend.cinema.repository.CinemaLocationRepository;
import backend.cinema.repository.CinemaNameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CinemaLocationService {
    private final CinemaLocationRepository cinemaLocationRepository;

    public List<CinemaLocationResponseDto> getCinemaLoctions(String cinemaName) {
        return cinemaLocationRepository.findLocationsByCinemaName(cinemaName);
    }
}