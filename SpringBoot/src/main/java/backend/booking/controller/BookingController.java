package backend.booking.controller;

import backend.booking.dto.BookingRequestDto;
import backend.booking.dto.BookingResponseDto;
import backend.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookingComplete.do")
    public ResponseEntity<?> completeBooking(@RequestBody BookingRequestDto requestDto) {
        try {
            BookingResponseDto response = bookingService.saveBooking(requestDto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            // 위변조, 좌석 중복, 인원 수 불일치 등의 검증 실패 처리
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "서버 내부 처리 중 오류가 발생했습니다."
            ));
        }
    }
}