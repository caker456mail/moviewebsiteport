package backend.cinema.repository;

import backend.cinema.domain.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CinemaRepository extends JpaRepository<Cinema,Long> {
    @Query(value = """
    

""",nativeQuery = true)
    List<Cinema> findCinemaname();
}



//package backend.cinema.repository;
//
//import backend.cinema.domain.CinemaMovie;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//
//import java.util.List;
//
//public interface CinemaRepository extends JpaRepository<CinemaMovie,Long> {
//    @Query(value = """
//        SELECT DISTINCT theater_name
//        FROM admin.cinema_movie
//        WHERE theater_name IS NOT NULL
//    """, nativeQuery = true)
//    List<String> findDistinctTheaterNames();
//}