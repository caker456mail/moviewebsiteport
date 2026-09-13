package backend.booking.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(schema = "admin", name = "bookings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imp_uid", length = 100)
    private String impUid;

    @Column(name = "merchant_uid", nullable = false, unique = true, length = 100)
    private String merchantUid;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(nullable = false, length = 50)
    private String gu;

    @Column(nullable = false, length = 50)
    private String branch;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "movie_title", nullable = false)
    private String movieTitle;

    @Column(name = "screening_time", nullable = false, length = 20)
    private String screeningTime;

    @Column(name = "adult_count", nullable = false)
    private int adultCount;

    @Column(name = "youth_count", nullable = false)
    private int youthCount;

    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingSeat> seats = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Booking(String impUid, String merchantUid, String brand, String city, String gu,
                   String branch, Long movieId, String movieTitle, String screeningTime,
                   int adultCount, int youthCount, int totalPrice, String paymentStatus) {
        this.impUid = impUid;
        this.merchantUid = merchantUid;
        this.brand = brand;
        this.city = city;
        this.gu = gu;
        this.branch = branch;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.screeningTime = screeningTime;
        this.adultCount = adultCount;
        this.youthCount = youthCount;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
    }

    public void addSeat(String seatNumber) {
        BookingSeat seat = BookingSeat.builder()
                .booking(this)
                .seatNumber(seatNumber)
                .build();
        this.seats.add(seat);
    }
}