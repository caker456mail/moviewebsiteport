import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PopupSuccess() {
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus("fail");
      setErrorMessage("결제 정보가 올바르지 않습니다.");
      return;
    }

    const confirmPayment = async () => {
      try {
        // 1. 백엔드 승인 API 호출 (본인 백엔드 엔드포인트로 변경)
        const response = await fetch("/api/payments/confirm.do", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "결제 승인에 실패했습니다.");
        }

        // 2. 승인 성공 시 부모 창(MainPage)으로 메시지 전송
        setStatus("success");
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "PAYMENT_SUCCESS",
              orderId,
              amount,
            },
            window.location.origin
          );
        }

        // 3. 잠시 안내 후 팝업 닫기
        setTimeout(() => {
          window.close();
        }, 1500);

      } catch (err: any) {
        console.error("결제 승인 오류:", err);
        setStatus("fail");
        setErrorMessage(err.message || "결제 처리 중 문제가 발생했습니다.");

        if (window.opener) {
          window.opener.postMessage(
            { type: "PAYMENT_FAIL", message: err.message },
            window.location.origin
          );
        }
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  return (
    <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
      {status === "loading" && (
        <>
          <h3>결제를 승인하는 중입니다...</h3>
          <p style={{ color: "#666" }}>잠시만 기다려주세요.</p>
        </>
      )}
      {status === "success" && (
        <>
          <h3 style={{ color: "#3182f6" }}>🎉 결제가 성공적으로 완료되었습니다!</h3>
          <p style={{ color: "#666" }}>주문번호: {orderId}</p>
          <p style={{ color: "#888", fontSize: "0.85rem" }}>창이 자동으로 닫힙니다...</p>
        </>
      )}
      {status === "fail" && (
        <>
          <h3 style={{ color: "#e50914" }}>결제 승인 실패</h3>
          <p style={{ color: "#666" }}>{errorMessage}</p>
          <button
            onClick={() => window.close()}
            style={{
              padding: "10px 20px",
              marginTop: "16px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            창 닫기
          </button>
        </>
      )}
    </div>
  );
}