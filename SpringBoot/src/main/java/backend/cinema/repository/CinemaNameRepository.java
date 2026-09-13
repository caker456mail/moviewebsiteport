package backend.cinema.repository;

import backend.cinema.domain.Cinema;
import backend.cinema.dto.CinemaNameDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CinemaNameRepository extends JpaRepository<Cinema,Long> {
    @Query("SELECT DISTINCT c.cinemaName AS cinemaName, c.cinemaImg AS cinemaImg, c.cinemaSite as cinemaSite FROM Cinema c")
    List<CinemaNameDto> findCinemanamerepository();
}


