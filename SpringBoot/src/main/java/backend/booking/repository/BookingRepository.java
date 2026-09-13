package backend.booking.repository;

import backend.booking.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 동일 지점, 영화, 상영시간에 이미 결제 완료(PAID)된 좌석이 있는지 검사
    @Query("SELECT bs.seatNumber FROM Booking b JOIN b.seats bs " +
            "WHERE b.branch = :branch " +
            "AND b.movieId = :movieId " +
            "AND b.screeningTime = :screeningTime " +
            "AND b.paymentStatus = 'PAID' " +
            "AND bs.seatNumber IN :seatNumbers")
    List<String> findAlreadyBookedSeats(
            @Param("branch") String branch,
            @Param("movieId") Long movieId,
            @Param("screeningTime") String screeningTime,
            @Param("seatNumbers") List<String> seatNumbers
    );
}