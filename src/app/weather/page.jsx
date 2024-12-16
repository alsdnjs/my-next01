import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ region }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("지역 정보:", region); // 지역 정보가 잘 전달되는지 확인
    if (!region) {
      setError("지역 정보가 없습니다.");
      setLoading(false);
      return;
    }

    // API 호출 함수
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&regId=11B00000&tmFc=202412160600`,
          {
            params: {
              serviceKey:
                "0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D",
              numOfRows: 1000,
              pageNo: 1,
              regId: getRegionCode(region),
              tmFc: "202412160600", // 예시 날짜
            },
          }
        );

        // 응답 구조 확인 후 데이터 설정
        if (response.data && response.data.response.body.items) {
          const items = response.data.response.body.items.item;
          if (items && items.length > 0) {
            setWeatherData(items[0]); // 첫 번째 항목만 사용
          } else {
            setError("날씨 데이터를 찾을 수 없습니다.");
          }
        } else {
          setError("날씨 데이터를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("API 호출 중 오류:", error);
        setError("날씨 데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData(); // API 호출
  }, [region]);

  const getRegionCode = (region) => {
    const regionCodes = {
      "강원도": "105",
      "서울, 인천, 경기도": "109",
      "충청북도": "131",
      "대전, 세종, 충청남도": "133",
      "전라북도": "146",
      "광주, 전라남도": "156",
      "대구, 경상북도": "143",
      "부산, 울산, 경상남도": "159",
      "제주도": "184",
    };
    return regionCodes[region] || "108"; // 기본값은 전국
  };

  if (loading) {
    return <div>날씨 데이터를 로딩 중...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      {weatherData && (
        <div>
          <h3>{region} 날씨</h3>
          <div>오전 날씨: {weatherData.wf4Am}</div>
          <div>오후 날씨: {weatherData.wf4Pm}</div>
        </div>
      )}
    </div>
  );
};

export default Weather;
