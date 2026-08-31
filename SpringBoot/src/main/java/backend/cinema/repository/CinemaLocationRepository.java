

package backend.cinema.repository;

import backend.cinema.domain.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CinemaLocationRepository extends JpaRepository<Cinema,Long> {
    @Query(value = """
    SELECT * FROM admin.cinema WHERE cinema_name = :cinemaName
""",nativeQuery = true)
    List<Cinema> findbycinemalocation(@Param("cinemaName") String cinemaName);
}