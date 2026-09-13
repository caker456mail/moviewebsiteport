package backend.booking.service;

import backend.booking.domain.Booking;
import backend.booking.dto.BookingRequestDto;
import backend.booking.dto.BookingResponseDto;
import backend.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    private static final int PRICE_ADULT = 15000;
    private static final int PRICE_YOUTH = 11000;

    @Transactional
    public BookingResponseDto saveBooking(BookingRequestDto dto) {
        // 1. 인원 수 및 좌석 수 검증
        int totalPeople = dto.getAdultCount() + dto.getYouthCount();
        if (totalPeople <= 0) {
            throw new IllegalArgumentException("관람 인원은 최소 1명 이상이어야 합니다.");
        }
        if (dto.getSeats() == null || dto.getSeats().size() != totalPeople) {
            throw new IllegalArgumentException("선택된 좌석 수(" +
                    (dto.getSeats() != null ? dto.getSeats().size() : 0) +
                    "개)와 총 인원수(" + totalPeople + "명)가 일치하지 않습니다.");
        }

        // 2. 결제 금액 위변조 검증 (서버 단가 기준으로 재계산)
        int calculatedPrice = (dto.getAdultCount() * PRICE_ADULT) + (dto.getYouthCount() * PRICE_YOUTH);
        if (calculatedPrice != dto.getTotalPrice()) {
            throw new IllegalStateException("결제 금액 위변조가 감지되었습니다. " +
                    "정상금액: " + calculatedPrice + "원, 요청금액: " + dto.getTotalPrice() + "원");
        }

        // 3. 중복 좌석 체크 (누군가 먼저 결제했는지 검증)
        List<String> duplicatedSeats = bookingRepository.findAlreadyBookedSeats(
                dto.getBranch(),
                dto.getMovieId(),
                dto.getTime(),
                dto.getSeats()
        );

        if (!duplicatedSeats.isEmpty()) {
            throw new IllegalStateException("이미 예매가 완료된 좌석이 포함되어 있습니다: " +
                    String.join(", ", duplicatedSeats));
        }

        // 4. Booking 엔티티 생성
        Booking booking = Booking.builder()
                .impUid(dto.getImpUid())
                .merchantUid(dto.getMerchantUid())
                .brand(dto.getBrand())
                .city(dto.getCity())
                .gu(dto.getGu())
                .branch(dto.getBranch())
                .movieId(dto.getMovieId())
                .movieTitle(dto.getMovieTitle())
                .screeningTime(dto.getTime())
                .adultCount(dto.getAdultCount())
                .youthCount(dto.getYouthCount())
                .totalPrice(calculatedPrice)
                .paymentStatus("PAID")
                .build();

        // 5. 좌석 추가 (CascadeType.ALL에 의해 booking_seats에 함께 자동 insert)
        for (String seat : dto.getSeats()) {
            booking.addSeat(seat);
        }

        Booking savedBooking = bookingRepository.save(booking);

        // 6. 결과 반환
        return BookingResponseDto.builder()
                .success(true)
                .message("예매가 성공적으로 완료되었습니다.")
                .bookingId(savedBooking.getId())
                .merchantUid(savedBooking.getMerchantUid())
                .movieTitle(savedBooking.getMovieTitle())
                .branch(savedBooking.getBranch())
                .screeningTime(savedBooking.getScreeningTime())
                .totalPeople(totalPeople)
                .seats(dto.getSeats())
                .totalPrice(savedBooking.getTotalPrice())
                .build();
    }
}