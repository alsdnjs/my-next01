"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import moment from "moment";
import "./paycalendar.css"; // CSS 파일 임포트
import axios from "axios"; // axios 임포트
import { getCookie } from "cookies-next"; // 쿠키에서 값 가져오는 함수
import useAuthStore from "store/authStore";

const PayCalendar = () => {
  const searchParams = useSearchParams();
  const campName = searchParams.get("name");
  const campPrice = searchParams.get("price")
    ? parseInt(searchParams.get("price"), 10)
    : 0;
  const contentId = searchParams.get("id");

  const [dateRange, setDateRange] = useState([null, null]);
  const [stayInfo, setStayInfo] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const token = useAuthStore((state) => state.token); // Zustand에서 token 가져오기
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [userIdx, setUserIdx] = useState(null);
  const [userName, setUserName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      getUserIdx(); // 토큰이 있으면 사용자 user_idx 가져오기
    }
  }, []);

  const getUserIdx = async () => {
    try {
      const API_URL = `${LOCAL_API_BASE_URL}/users/profile`;
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 사용
        },
      });
  
      if (response.data.success) {
        const userIdx = response.data.data.user_idx; // user_idx 추출
        const userName = response.data.data.username;
        setUserName(userName);
        setUserIdx(userIdx); // response에서 받아온 userIdx를 설정
        console.log(userIdx);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
 

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1";
    script.onload = () => {
      if (window.TossPayments) {
        setIsPaymentReady(true);
      } else {
        console.error("TossPayments SDK 로드 실패");
      }
    };
    script.onerror = () => console.error("TossPayments SDK 로드 실패");
    document.body.appendChild(script);
  }, []);

  const onChange = (range) => {
    setDateRange(range);

    if (range[0] && range[1]) {
      const startDate = dayjs(range[0]).startOf("day");
      const endDate = dayjs(range[1]).endOf("day");
      const days = calculateDays(startDate, endDate);

      setStayInfo(`${days.nights}박 ${days.days}일`);
      setTotalPrice(campPrice * days.nights);
    } else {
      setStayInfo("");
      setTotalPrice(0);
    }
  };

  const calculateDays = (startDate, endDate) => {
    const nights = endDate.diff(startDate, "day");
    const days = nights + 1;
    return { nights, days };
  };

  const handlePayment = async () => {
    console.log("contentId:", contentId);
    console.log("user_idx:", userIdx); // user_idx만 가져오기
    if (isPaymentReady) {
      try {
        const orderId = `order-${Date.now()}`; // 고유한 주문 ID 생성
        console.log("isPaymentReady 상태:", isPaymentReady);

        if (!process.env.NEXT_PUBLIC_CLIENT_KEY) {
          throw new Error(
            "환경 변수에 클라이언트 키(NEXT_PUBLIC_CLIENT_KEY)가 설정되지 않았습니다."
          );
        }

        const tossPayments = window.TossPayments(
          process.env.NEXT_PUBLIC_CLIENT_KEY
        );

        // 결제 요청 후 paymentKey를 받아옴
        const { paymentKey } = await tossPayments.requestPayment("카드", {
          amount: totalPrice,
          orderId,
          orderName: `${campName}`,
          customerName: userName, // 사용자 이름 가져오기
          successUrl: `${window.location.origin}/reservation/success`,
          failUrl: `${window.location.origin}/reservation/fail`,
        });

        // 결제 후 서버로 결제 정보 저장
        const paymentData = {
          id: userIdx, // user_idx만 가져오기
          action_type: "예약",
          action_date: new Date().toISOString(),
          payment_amount: totalPrice,
          contentId, // contentId 포함
          orderId,
          campName,
          stayInfo,
        };

        await axios
          .post("http://localhost:8080/api/camping/payments", paymentData)
          .then((response) => {
            console.log("결제 정보 저장 성공:", response.data);
          })
          .catch((error) => {
            console.error("결제 정보 저장 실패:", error);
          });

        // 결제 확인 요청 (paymentKey 사용)
        const paymentVerification = await tossPayments.verifyPayment(paymentKey);
        console.log("결제 확인 결과:", paymentVerification);

        // 결제 성공 처리
        if (paymentVerification.status === "SUCCESS") {
          router.push(`/reservation/success`);
        } else {
          alert("결제 실패: 상태 확인 필요");
        }

      } catch (error) {
        console.error("결제 실패:", {
          code: error?.code || "UNKNOWN",
          message: error?.message || "알 수 없는 오류",
          details: error?.details || "세부 정보 없음",
        });
        alert(`결제에 실패했습니다: ${error?.message || "알 수 없는 오류"}`);
      }
    } else {
      console.log("TossPayments SDK가 준비되지 않음");
      alert("결제를 준비할 수 없습니다. 잠시 후 다시 시도하세요.");
    }
  };

  return (
    <div className="pay-calendar-container">
      <h1>{campName || "캠핑장 이름 없음"}</h1>
      <p>
        1박 기준 가격:{" "}
        {campPrice ? `${campPrice.toLocaleString()}원` : "정보 없음"}
      </p>

      <div className="pay-calendar-calendar-container">
        <Calendar
          locale="en"
          onChange={onChange}
          selectRange={true}
          value={dateRange}
          formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
          calendarType="gregory"
          className="custom-calendar"
          tileClassName="custom-tile"
          prev2Label={null}
          next2Label={null}
        />
      </div>

      <div className="pay-calendar-info-container">
        {dateRange[0] && dateRange[1] && (
          <div className="pay-calendar-stay-info">
            <p>캠핑장 이름: {campName || "캠핑장 이름 없음"}</p>
            <p>체크인: {formatDate(dateRange[0])} (오전 11시)</p>
            <p>체크아웃: {formatDate(dateRange[1])} (오후 3시)</p>
            <p>선택하신 기간: {stayInfo}</p>
            <p>총 결제 금액: {totalPrice.toLocaleString()}원</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={!stayInfo}
          className="pay-calendar-button"
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export default PayCalendar;
