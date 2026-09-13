package backend.booking.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BookingRequestDto {
    private String impUid;
    private String merchantUid;
    private String brand;
    private String city;
    private String gu;
    private String branch;
    private Long movieId;
    private String movieTitle;
    private String time;
    private int adultCount;
    private int youthCount;
    private List<String> seats;
    private int totalPrice;
}