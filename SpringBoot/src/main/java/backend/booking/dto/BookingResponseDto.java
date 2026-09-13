package backend.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class BookingResponseDto {
    private boolean success;
    private String message;
    private Long bookingId;
    private String merchantUid;
    private String movieTitle;
    private String branch;
    private String screeningTime;
    private int totalPeople;
    private List<String> seats;
    private int totalPrice;
}