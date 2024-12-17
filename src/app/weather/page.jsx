"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ region }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 지역명으로 날씨 API의 지역 코드 변환
  const getRegionCode = (region) => {
    const regionCodes = {
      "서울": "11B00000", // 서울, 인천, 경기도
      "인천": "11B00000",
      "경기도": "11B00000",
      "강원도영서": "11D10000",
      "강원도영동": "11D20000",
      "대전": "11C20000", // 대전, 세종, 충청남도
      "세종": "11C20000",
      "충청남도": "11C20000",
      "충청북도": "11C10000",
      "광주": "11F20000", // 광주, 전라남도
      "전라남도": "11F20000",
      "전라북도": "11F10000",
      "대구": "11H10000", // 대구, 경상북도
      "경상북도": "11H10000",
      "부산": "11H20000", // 부산, 울산, 경상남도
      "울산": "11H20000",
      "경상남도": "11H20000",
      "제주도": "11G00000",
    };
  
    // 지역명이 공백으로 구분된 경우 첫 번째 단어만 추출
    const mainRegion = region?.split(" ")[0]; // "서울특별시 강남구" → "서울특별시"
    const simplifiedRegion = mainRegion?.replace("특별시", "").replace("광역시", "").replace("도", "");
  
    return regionCodes[simplifiedRegion] || "108"; // 기본값: 전국 코드
  };

  // 발표 시간 생성 (현재 날짜 기준)
  const getCurrentTmFc = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = now.getHours() < 18 ? "0600" : "1800";
    return `${year}${month}${day}${hour}`;
  };

  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      console.log("지역 정보:", region);

      const regionCode = getRegionCode(region); // 지역 코드 가져오기
      const tmFc = getCurrentTmFc(); // 발표 시간 생성

      try {
        const response = await axios.get(
          "https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&regId=11B00000&tmFc=202412161800",
          {
            params: {
              serviceKey: '0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D', // 공공 데이터 API 키
              numOfRows: 1000,
              pageNo: 1,
              regId: regionCode,
              tmFc: tmFc,
              dataType: "JSON",
            },
          }
        );

        console.log("API 응답 데이터:", response.data);

        // 응답 데이터 구조 확인 후 설정
        const body = response.data.response?.body; // body가 존재하는지 확인
        const items = body?.items?.item; // items가 존재하는지 확인

        if (Array.isArray(items) && items.length > 0) {
          setWeatherData(items[0]); // 첫 번째 항목 사용
          
        } else {
          setError("날씨 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("기타 오류:", err.message || err.toString());
        setError("기타 오류: " + (err.message || err.toString()));
      } finally {
        setLoading(false);
      }
    };

    if (region) {
      fetchWeatherData(); // 데이터 호출
    }
  }, [region]);

  if (loading) return <div>날씨 데이터를 로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h3>{region} 날씨 정보</h3>
      <p>오전 날씨: {weatherData?.wf4Am || "정보 없음"}</p>
      <p>오후 날씨: {weatherData?.wf4Pm || "정보 없음"}</p>
    </div>
  );
};

export default Weather;
