package backend.cinema.repository;

import backend.cinema.domain.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CinemaNameRepository extends JpaRepository<Cinema,Long> {
    @Query(value = """
    SELECT DISTINCT(cinema_name),cinema_img FROM admin.cinema;
""",nativeQuery = true)
    List<Cinema> findCinemanamerepository();
}


