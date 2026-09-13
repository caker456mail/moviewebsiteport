import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function PaymentPopup() {
  const isRequested = useRef(false);

  useEffect(() => {
    if (isRequested.current) return;
    isRequested.current = true;

    const rawData = sessionStorage.getItem("toss_current_booking");
    if (!rawData) {
      alert("예매 정보가 유효하지 않습니다.");
      window.close();
      return;
    }

    const bookingData = JSON.parse(rawData);

    if (!window.TossPayments) {
      alert("토스 결제 모듈을 로드하지 못했습니다.");
      window.close();
      return;
    }

    const executePayment = async () => {
      try {
        // 1. 토스 v2 초기화
        const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8g3N97Eoqd";
        const tossPayments = window.TossPayments(clientKey);

        // 2. v2 전용 payment 인스턴스 생성 (익명 고객키)
        const payment = tossPayments.payment({
          customerKey: window.TossPayments.ANONYMOUS,
        });

        const orderId = `order_${new Date().getTime()}`;

        // 3. 토스 v2 표준 결제창 호출 (메서드 명칭: CARD)
        await payment.requestPayment({
          method: "CARD",
          amount: {
            currency: "KRW",
            value: bookingData.totalPrice,
          },
          orderId: orderId,
          orderName: `${bookingData.movieTitle} (${bookingData.totalPeople}인)`,
          customerName: "홍길동",
          successUrl: `${window.location.origin}/payment-success`,
          failUrl: `${window.location.origin}/payment-fail`,
        });
      } catch (error: any) {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "TOSS_PAYMENT_RESULT",
              status: "FAIL",
              message: error.code === "USER_CANCEL" ? "사용자가 결제를 취소했습니다." : (error.message || "결제 중 오류가 발생했습니다."),
            },
            window.location.origin
          );
        }
        window.close();
      }
    };

    executePayment();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#18181c",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>토스 결제창을 불러오는 중입니다...</h3>
      <p style={{ color: "#aaa", fontSize: "0.9rem" }}>잠시만 기다려주세요.</p>
    </div>
  );
}