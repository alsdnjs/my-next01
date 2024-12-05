import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const Test = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [campingData, setCampingData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 고캠핑 API 호출을 위한 지역 매핑
  const regionMapping = {
    "경기도": "Gyeonggi-do",
    "강원도": "Gangwon-do",
    "서울": "Seoul",
    // 추가적으로 더 많은 지역을 매핑합니다
  };

  // GeoJSON 파일 로드
  useEffect(() => {
    fetch('/data/myGeoJSON.json') // 경로에 맞게 수정
      .then((response) => response.json())
      .then((data) => {
        console.log('GeoJSON 데이터 로드 성공:', data);
        setGeoJsonData(data);
      })
      .catch((error) => console.error('GeoJSON 데이터 로드 실패:', error));
  }, []);

  // 고캠핑 공공데이터 API 호출
  const fetchCampingData = (regionName) => {
    setLoading(true);
    const apiKey = '0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D'; // 실제 키로 변경
    const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&CTP_KOR_NM=${encodeURIComponent(regionName)}`;

    axios.get(url)
      .then((response) => {
        console.log('캠핑장 데이터 로드 성공:', response.data);
        setCampingData(response.data.response.body.items.item || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('캠핑장 데이터 로드 실패:', error);
        setLoading(false);
      });
  };

  // GeoJSON 지역 클릭 시 호출되는 함수
  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.CTP_KOR_NM;
    const mappedRegionName = regionMapping[regionName];
    if (mappedRegionName) {
      console.log(`${regionName} → ${mappedRegionName}로 매핑됨`);
      fetchCampingData(mappedRegionName); // 해당 지역의 캠핑장 데이터 호출
    } else {
      console.log(`매핑된 지역이 없습니다: ${regionName}`);
    }
  };

  return (
    <div>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer center={[37.146001, 129.363397]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {geoJsonData && <GeoJSON data={geoJsonData} onEachFeature={onEachFeature} />}
        </MapContainer>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>캠핑장 목록</h2>
        {loading ? <p>데이터 로딩 중...</p> : (
          <ul>
            {campingData.map((camp, index) => (
              <li key={index}>{camp.facltNm} - {camp.addr1}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Test;
