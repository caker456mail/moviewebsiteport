package backend.Api.Tosspayment.domain;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(schema = "admin", name = "payments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String paymentKey;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(nullable = false)
    private String orderName;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String status; // DONE 등

    private String method; // 카드 등

    private LocalDateTime approvedAt;

    @Builder
    public Payment(String paymentKey, String orderId, String orderName, Long amount, String status, String method, LocalDateTime approvedAt) {
        this.paymentKey = paymentKey;
        this.orderId = orderId;
        this.orderName = orderName;
        this.amount = amount;
        this.status = status;
        this.method = method;
        this.approvedAt = approvedAt;
    }
}