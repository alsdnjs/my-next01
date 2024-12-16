"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // URL 쿼리 파라미터 접근
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 캘린더 스타일
import dayjs from 'dayjs';
import moment from 'moment';

import "./paycalendar.css"; // CSS 파일 임포트


const PayCalendar = () => {
  const searchParams = useSearchParams(); // URL 쿼리 파라미터 접근
  const campName = searchParams.get("name"); // 캠핑장 이름
  const campPrice = searchParams.get("price") ? parseInt(searchParams.get("price"), 10) : 0; // 캠핑장 가격 (숫자 변환)

  const [dateRange, setDateRange] = useState([null, null]); // 체크인/체크아웃 날짜 저장
  const [stayInfo, setStayInfo] = useState(""); // 몇 박 몇 일 계산 결과 저장
  const [hydrated, setHydrated] = useState(false); // 클라이언트 렌더링 확인용
  const [totalPrice, setTotalPrice] = useState(0); // 총 결제 금액 저장

  const router = useRouter(); // useRouter 훅 사용
  // 클라이언트에서만 활성화
  useEffect(() => {
    setHydrated(true); // 렌더링 준비 완료
    console.log("캠핑장 이름:", campName);  // 캠핑장 이름 확인
    console.log("캠핑장 가격:", campPrice); // 캠핑장 가격 확인
  }, [campName, campPrice]);

  if (!hydrated) {
    return null; // 클라이언트가 준비되기 전까지는 아무것도 렌더링하지 않음
  }

  const onChange = (range) => {
    setDateRange(range); // 선택된 날짜 범위 업데이트
  
    if (range[0] && range[1]) {
      const startDate = dayjs(range[0]).startOf('day'); // 시작 날짜를 00:00:00로 설정
      const endDate = dayjs(range[1]).endOf('day'); // 종료 날짜를 23:59:59로 설정
  
      const days = calculateDays(startDate, endDate);
      setStayInfo(`${days.nights}박 ${days.days}일`);
      setTotalPrice(campPrice * days.nights); // 총 결제 금액 계산
    } else {
      setStayInfo(""); // 범위가 완성되지 않았을 경우 초기화
      setTotalPrice(0);
    }
  };
  
  // 몇 박 몇 일 계산
  const calculateDays = (startDate, endDate) => {
    const nights = endDate.diff(startDate, 'day'); // 'day' 단위로 차이를 구함
    const days = nights + 1; // 박 수 + 1 = 일 수
    return { nights, days };
  };

  const handlePayment = () => {
    // 결제 로직 추가
    console.log("결제 진행:", totalPrice);
    // 결제 페이지로 이동
    router.push('/payment'); 
  };

  return (
    <div className="pay-calendar-container">
      <h1>{campName || "캠핑장 이름 없음"}</h1> {/* 캠핑장 이름 표시 */}
      <p>1박 기준 가격: {campPrice ? `${campPrice.toLocaleString()}원` : "정보 없음"}</p> {/* 캠핑장 가격 표시 */}
    
      <div className="pay-calendar-calendar-container">
        <Calendar
          locale="en"
          onChange={onChange}
          selectRange={true} // 날짜 범위 선택 가능
          value={dateRange}
          formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 몇년. 몇월 이렇게 보이도록 설
          calendarType="gregory" // 일요일 부터 시작
          className="custom-calendar"
          tileClassName="custom-tile"
          prev2Label={null}
          next2Label={null}
        />
      </div>
    
      <div className="pay-calendar-info-container">
        {dateRange[0] && dateRange[1] && (
          <div className="pay-calendar-stay-info">
            <p>캠핑장 이름: {campName || "캠핑장 이름 없음"}</p> {/* 캠핑장 이름 표시 */}
            <p>체크인: {formatDate(dateRange[0])} (오전 11시)</p>
            <p>체크아웃: {formatDate(dateRange[1])} (오후 3시)</p>
            <p>선택하신 기간: {stayInfo}</p>
            <p>총 결제 금액: {totalPrice.toLocaleString()}원</p>
          </div>
        )}
        
        <button
          onClick={handlePayment} 
          disabled={!stayInfo} // stayInfo가 비어 있으면 버튼 비활성화
          className="pay-calendar-button"
        >
          결제하기
        </button>
      </div>
    </div>
  );
};

// 날짜 포맷 함수 (YYYY-MM-DD)
const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD"); // dayjs로 날짜 포맷
};

export default PayCalendar;
