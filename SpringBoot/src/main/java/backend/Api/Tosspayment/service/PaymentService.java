package backend.Api.Tosspayment.service;


import backend.Api.Tosspayment.domain.Payment;
import backend.Api.Tosspayment.dto.PaymentConfirmRequestDto;
import backend.Api.Tosspayment.dto.PaymentConfirmResponseDto;
import backend.Api.Tosspayment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${toss.secret-key}")
    private String secretKey;

    @Value("${toss.confirm-url}")
    private String confirmUrl;

    @Transactional
    public PaymentConfirmResponseDto confirmPayment(PaymentConfirmRequestDto requestDto) {
        // 1. Basic Auth 헤더 생성 (시크릿 키 뒤에 ':' 추가 후 Base64 인코딩)
        String authorizations = "Basic " + Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        // 2. 토스 승인 API 호출 (RestClient 사용)
        RestClient restClient = RestClient.create();

        PaymentConfirmResponseDto response;
        try {
            response = restClient.post()
                    .uri(confirmUrl)
                    .header(HttpHeaders.AUTHORIZATION, authorizations)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "paymentKey", requestDto.getPaymentKey(),
                            "orderId", requestDto.getOrderId(),
                            "amount", requestDto.getAmount()
                    ))
                    .retrieve()
                    .body(PaymentConfirmResponseDto.class);
        } catch (Exception e) {
            log.error("토스 승인 요청 실패: {}", e.getMessage());
            throw new RuntimeException("결제 승인 중 오류가 발생했습니다: " + e.getMessage());
        }

        if (response == null || !"DONE".equals(response.getStatus())) {
            throw new IllegalStateException("결제 승인이 완료되지 않았습니다.");
        }

        // 3. 결제 내역 DB 저장
        OffsetDateTime parsedApprovedAt = response.getApprovedAt() != null
                ? OffsetDateTime.parse(response.getApprovedAt())
                : OffsetDateTime.now();

        Payment payment = Payment.builder()
                .paymentKey(response.getPaymentKey())
                .orderId(response.getOrderId())
                .orderName(response.getOrderName() != null ? response.getOrderName() : "영화 예매")
                .amount(response.getTotalAmount())
                .status(response.getStatus())
                .method(response.getMethod())
                .approvedAt(parsedApprovedAt.toLocalDateTime())
                .build();

        paymentRepository.save(payment);

        return response;
    }
}