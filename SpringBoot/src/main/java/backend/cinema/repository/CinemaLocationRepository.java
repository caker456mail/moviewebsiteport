package backend.cinema.repository;

import backend.cinema.domain.Cinema;
import backend.cinema.dto.CinemaLocationResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CinemaLocationRepository extends JpaRepository<Cinema, Long> {

    @Query("SELECT c.cinemaName AS cinemaName, c.cinemaLocation AS cinemaLocation " +
            "FROM Cinema c " +
            "WHERE c.cinemaName = :cinemaname")
    List<CinemaLocationResponseDto> findLocationsByCinemaName(@Param("cinemaname") String cinemaname);
}