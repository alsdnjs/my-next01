import React, { useEffect, useState, useRef } from "react";

const Medical = ({ latitude, longitude }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [noPharmacies, setNoPharmacies] = useState(false);
  const [infowindow, setInfowindow] = useState(null); // 인포윈도우를 상태로 관리

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=82653f2edcf163a11fb5d8dc0dab9587&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const { kakao } = window;

        const container = document.getElementById("campingMap");
        const options = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 7,
        };

        const map = new kakao.maps.Map(container, options);
        mapRef.current = map;

        const campingMarkerPosition = new kakao.maps.LatLng(latitude, longitude);
        const campingMarker = new kakao.maps.Marker({
          position: campingMarkerPosition,
        });
        campingMarker.setMap(map);

        const fetchPharmacies = async () => {
          try {
            const response = await fetch(
              "https://apis.data.go.kr/B551182/pharmacyInfoService/getParmacyBasisList?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&pageNo=1&numOfRows=1000&xPos=127.0965441345503&yPos=37.60765568913871&radius=470000"
            );

            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const items = xmlDoc.getElementsByTagName("item");

            const calculateDistance = (lat1, lon1, lat2, lon2) => {
              const R = 6371;
              const dLat = ((lat2 - lat1) * Math.PI) / 180;
              const dLon = ((lon2 - lon1) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                  Math.cos((lat2 * Math.PI) / 180) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return R * c;
            };

            const pharmacyList = Array.from(items)
              .map((item) => {
                const yPos = parseFloat(
                  item.getElementsByTagName("YPos")[0].textContent
                );
                const xPos = parseFloat(
                  item.getElementsByTagName("XPos")[0].textContent
                );
                const yadmNm = item.getElementsByTagName("yadmNm")[0].textContent;
                const telno =
                  item.getElementsByTagName("telno")[0]?.textContent || "전화번호 없음";

                const distance = calculateDistance(latitude, longitude, yPos, xPos);
                return { yPos, xPos, yadmNm, telno, distance };
              })
              .filter((pharmacy) => pharmacy.distance <= 5);

            if (pharmacyList.length === 0) {
              setNoPharmacies(true);
            } else {
              setNoPharmacies(false);
            }

            setPharmacies(pharmacyList);
          } catch (error) {
            console.error("약국 정보 로딩 실패", error);
          } finally {
            setLoading(false);
          }
        };

        fetchPharmacies();
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (pharmacies.length > 0 && mapRef.current) {
      const { kakao } = window;
      const map = mapRef.current;

      pharmacies.forEach((pharmacy) => {
        const { xPos, yPos, yadmNm } = pharmacy;
        const markerPosition = new kakao.maps.LatLng(yPos, xPos);

        const redMarkerImage = new kakao.maps.MarkerImage(
          "/images/red.png",
          new kakao.maps.Size(40, 40),
          {
            offset: new kakao.maps.Point(27, 69),
          }
        );

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: redMarkerImage,
        });

        marker.setMap(map);

        const newInfoWindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;z-index:1;">${yadmNm}</div>`,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          if (infowindow) {
            infowindow.close(); // 기존 인포윈도우 닫기
          }
          newInfoWindow.open(map, marker); // 새 인포윈도우 열기
          setInfowindow(newInfoWindow); // 상태 업데이트
        });
      });
    }
  }, [pharmacies, infowindow]); // infowindow 상태가 변경될 때만 실행

  return (
    <div>
      <div id="campingMap" className="map" />
      <div>
        <h2>5km 이내 약국 목록</h2>
        {loading ? (
          <p>약국 정보를 찾고 있습니다. 잠시만 기다려 주세요...</p>
        ) : noPharmacies ? (
          <p>5km 이내의 약국 정보가 없습니다</p>
        ) : (
          <ul>
            {pharmacies.map((pharmacy, index) => (
              <li key={index}>
                <strong>{pharmacy.yadmNm}</strong> - {pharmacy.telno}
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        #campingMap {
          width: 100%;
          height: 400px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin: 5px 0;
          padding: 10px;
          transition: all 0.3s ease;
        }

        li:hover {
          background-color: #f1f1f1;
          transform: translateY(-2px);
        }

        li strong {
          color: #333;
          font-size: 1.1em;
          font-weight: bold;
        }

        li p {
          color: #555;
        }

        p {
          font-size: 16px;
          color: #333;
          text-align: center;
        }

        h2 {
          text-align: center;
          font-size: 1.5em;
          color: #444;
        }
      `}</style>
    </div>
  );
};

export default Medical;
