package backend.Api.Tosspayment.controller;

import backend.Api.Tosspayment.dto.PaymentConfirmRequestDto;
import backend.Api.Tosspayment.dto.PaymentConfirmResponseDto;
import backend.Api.Tosspayment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // 👇 "/confirm" -> "/confirm.do" 로 변경
    @PostMapping("/confirm.do")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmRequestDto requestDto) {
        System.out.println("=================================================");
        System.out.println(">>> [결제 승인 컨트롤러 진입 성공]");
        System.out.println(">>> orderId: " + requestDto.getOrderId());
        System.out.println(">>> amount: " + requestDto.getAmount());
        System.out.println(">>> paymentKey: " + requestDto.getPaymentKey());
        System.out.println("=================================================");

        try {
            PaymentConfirmResponseDto result = paymentService.confirmPayment(requestDto);
            System.out.println(">>> [결제 승인 완료 성공]");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println(">>> [결제 승인 처리 중 에러 발생]: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}