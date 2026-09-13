package backend.Api.Tosspayment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaymentConfirmResponseDto {
    private String paymentKey;
    private String orderId;
    private String orderName;
    private String status; // DONE, CANCELED 등
    private String requestedAt;
    private String approvedAt;
    private Long totalAmount;
    private String method; // 카드, 가상계좌 등
}