import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "X5gD6hPDmQP5kP7IyKNtQ";

export default function PaymentPopup() {
  const [searchParams] = useSearchParams();
  const amount = Number(searchParams.get("amount")) || 15000;
  const orderName = searchParams.get("orderName") || "영화 티켓 예매";

  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const paymentMethodWidgetRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const loadedWidget = await loadPaymentWidget(widgetClientKey, customerKey);

        const methodWidget = loadedWidget.renderPaymentMethods(
          "#payment-method",
          { value: amount },
          { variantKey: "DEFAULT" }
        );

        loadedWidget.renderAgreement("#agreement", {
          variantKey: "AGREEMENT",
        });

        setPaymentWidget(loadedWidget);
        paymentMethodWidgetRef.current = methodWidget;
      } catch (error) {
        console.error("결제위젯 로드 실패:", error);
      }
    })();
  }, [amount]);

  const handleRequestPayment = async () => {
    if (!paymentWidget) return;

    try {
      await paymentWidget.requestPayment({
        orderId: `ORDER_${Date.now()}`,
        orderName: orderName,
        successUrl: `${window.location.origin}/popup-success`,
        failUrl: `${window.location.origin}/popup-fail`,
        customerName: "홍길동",
      });
    } catch (error) {
      console.error("결제 요청 에러:", error);
    }
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "16px", color: "#111" }}>
        결제하기 ({amount.toLocaleString()}원)
      </h2>

      {/* 결제위젯 렌더링 컨테이너 */}
      <div id="payment-method" />
      <div id="agreement" />

      <button
        type="button"
        onClick={handleRequestPayment}
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "20px",
          backgroundColor: "#3182f6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {amount.toLocaleString()}원 결제 진행
      </button>
    </div>
  );
}