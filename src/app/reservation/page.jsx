"use client"
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PayCalendar = () => {
  const [date, setDate] = useState(null);  // 초기 상태를 null로 설정

  // 클라이언트에서만 상태 업데이트하도록 useEffect 사용
  useEffect(() => {
    setDate(new Date());  // 클라이언트에서만 초기 날짜 설정
  }, []);

  // 날짜 선택 시 업데이트
  const onChange = (newDate) => {
    setDate(newDate);
  };

  if (!date) return null;  // 아직 상태가 설정되지 않았으면 렌더링하지 않음

  return (
    <div style={calendarContainerStyle}>
      <Calendar
        onChange={onChange}
        value={date}
        className="custom-calendar"
        tileClassName="custom-tile"
        prev2Label={null}
        next2Label={null}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            return null;  // 날짜 타일에서 "일" 텍스트를 숨김
          }
          return null;  // "일" 텍스트를 숨기는 부분
        }}
      />
    </div>
  );
};

const calendarContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '50px 0',
  fontFamily: 'Arial, sans-serif',
};

export default PayCalendar;
