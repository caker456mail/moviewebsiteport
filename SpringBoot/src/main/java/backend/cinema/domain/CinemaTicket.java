//package backend.cinema.domain;
//
//import jakarta.persistence.*;
//import lombok.AccessLevel;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//
//@Entity
//@Table(name = "cinema_ticket", schema = "admin")
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//public class CinemaTicket {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "reservation_no")
//    private String reservationNo;
//
//    @Column(name = "theater_name")
//    private String theaterName;
//
//    @Column(name = "movie_title")
//    private String movieTitle;
//
//    @Column(name = "screening_date")
//    private LocalDate screeningDate;
//
//    @Column(name = "screening_time")
//    private LocalTime screeningTime;
//
//    @Column(name = "seat_no")
//    private String seatNo;
//
//    @Column(name = "reservation_count")
//    private Integer reservationCount;
//
//    @Column(name = "cancel_count")
//    private Integer cancelCount;
//
//    @Column(name = "created_at", insertable = false, updatable = false)
//    private LocalDateTime createdAt;
//}