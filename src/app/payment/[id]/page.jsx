"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation"; // URL 쿼리 파라미터 접근

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const totalPrice = searchParams.get("totalPrice");
  const campName = searchParams.get("campName"); // 캠핑장 이름
  

  const [isPaymentWidgetReady, setIsPaymentWidgetReady] = useState(false);

  const paymentWidgetRef = useRef(null); // ref 정의

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.tosspayments.com/js/tossPayments.js";
    script.onload = () => {
      if (window.TossPayments) {
        console.log("TossPayments SDK 로드 완료");
        setIsPaymentWidgetReady(true);
      } else {
        console.error("TossPayments SDK 로드 실패");
      }
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    if (isPaymentWidgetReady && paymentWidgetRef.current) {
      const tossPayments = window.TossPayments("test_ck_DnyRpQWGrNlDNpdJB4lO3Kwv1M9E");
      const paymentData = {
        amount: totalPrice, // 결제 금액
        orderId: `order-${campName}`, // 주문 ID
        orderName: `Camping Reservation: ${campName}`, // 캠핑장 이름
        customerName: "홍길동", // 고객 이름
        successUrl: `http://localhost:8080/paymentSuccess?orderId=order-${campName}`,
        failUrl: `http://localhost:8080/paymentFail?orderId=order-${campName}`
      };

      // 결제 위젯 삽입
      tossPayments.requestPayment("카드", paymentData);
    } else {
      console.log("결제 위젯 준비되지 않음");
    }
  };

  return (
    <div>
      <h1>결제 진행 중...</h1>
      <p>결제 금액: {totalPrice}원</p>
      <p>캠핑장 이름: {campName}</p>
      

      {/* 결제 위젯을 렌더링할 DOM 요소 */}
      <div id="payment-widget-container" ref={paymentWidgetRef}></div>

      {/* 결제 버튼 */}
      <button onClick={handlePayment} disabled={!isPaymentWidgetReady}>
        결제하기
      </button>
    </div>
  );
};

export default PaymentPage;
