"use client";

import React, { useState, useEffect, use } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation"; // 라우터 사용

import "./styles.css";
// import { useRouter } from "next/navigation";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {
  SportsSoccer,
  Wifi,
  LocalFireDepartment,
  Pool,
  ChildCare,
  ShoppingCart,
  Store,
} from "@mui/icons-material";
import HikingIcon from "@mui/icons-material/Hiking";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



export default function CampingDetail({ params }) {
  const {id} = use(params); // URL에서 받은 id 값
  const [data, setData] = useState(null); // 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();
  // 추천하기 여부
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // 데이터를 비동기로 가져오는 함수
    const fetchData = async () => {
      try {
        // API URL을 동적으로 생성하여 fetch 호출
        const response = await fetch(
          `https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=oJ92%2B%2B%2F21TTjpplTdJxaX5%2FoWlRWSvc8zFOZiNLOWepUxbQCy390qXcnw%2F3DhJa8U657fjJ%2FivV3vYmzto%2Bp4A%3D%3D&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // 캠핑장 데이터 중에서 해당 id에 맞는 데이터만 필터링
        const campground = result.response.body.items.item.find(
          (item) => item.contentId === id
        );

        setData(campground); // 데이터 설정
      } catch (error) {
        console.error("Error fetching data:", error); // 에러 처리
        setError("데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchData(); // 컴포넌트가 렌더링될 때 호출
  }, [id]); // id가 변경되면 데이터 다시 가져오기
  // 캠핑장 정보 탭 변경함수
  const [activeTab, setActiveTab] = useState("intro");
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  // 클릭 시 상태 변경
 const reserveClick = () => {
   setIsRecommended(prevState => !prevState); // 상태를 반전시켜 추천 여부 변경
 };
 // 클릭 시 상태 변경
 const saveClick = () => {
   setIsSaved(prevState => !prevState);
 }
   // 주요 시설 정보 매핑
   const getFacilityInfo = () => {
    const facilities = [];
    if (data.induty.includes("일반 야영장")) {
      facilities.push({ name: "일반 야영장", value: data.gnrlSiteCo });
    }
    if (data.induty.includes("자동차 야영장")) {
      facilities.push({ name: "자동차 야영장", value: data.autoSiteCo });
    }
    if (data.induty.includes("글램핑")) {
      facilities.push({ name: "글램핑", value: data.glampSiteCo });
    }
    if (data.induty.includes("카라반")) {
      facilities.push({ name: "카라반", value: data.caravSiteCo });
    }
    if (data.induty.includes("개인 카라반")) {
      facilities.push({ name: "개인 카라반", value: data.indvdlCaravSiteCo });
    }
    return facilities;
  };

  const facilityInfo = getFacilityInfo();
  return (
    <div>
     
      {data ? (
        <>
       
          <div id="camping-inner">
            <div className="camping_layout">
              <div className="camping_info_box">
                <div className="img_b">
                  <img src={data.firstImageUrl} alt=""/>
                </div>
                <div className="content_tb">
                  <table className="table">
                    <colgroup>
                      <col style={{width: "30%"}} />
                      <col style={{width: "70%"}} />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th scope="col">주소</th>
                        <td>{data.addr1}</td>
                      </tr>
                      <tr>
                        <th scope="col">문의처</th>
                        <td>{data.tel}</td>
                      </tr>
                      <tr>
                        <th scope="col">캠핑장 유형</th>
                        <td>{data.induty}</td>
                      </tr>
                      <tr>
                        <th scope="col">운영기간</th>
                        <td>{data.operPdCl}</td>
                      </tr>
                      <tr>
                        <th scope="col">운영일</th>
                        <td>{data.operDeCl}</td>
                      </tr>
                      <tr>
                        <th scope="col">홈페이지</th>
                        <td><a href={data.homepage} target="_BLANK" title="새창열림">홈페이지 바로가기</a></td>
                      </tr>
                      <tr>
                        <th scope="col">주변이용가능시설</th>
                        <td>{data.posblFcltyCl}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="btn">
                    <Button type="button" className="reserve" onClick={reserveClick}><AddToHomeScreenIcon/>예약하기</Button>
                    <Button type="button" className="save"onClick={saveClick}>{isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}찜하기</Button>
                  </div>

                </div>

              </div>
            </div>

          </div>
          <div className="camping-info">
            <div className="tabs">
                <Button className={`tab-button ${activeTab === "intro" ? "active" : ""}`} onClick={() => setActiveTab("intro")}>캠핑장 소개</Button>
                <Button className={`tab-button ${activeTab === "usage" ? "active" : ""}`} onClick={() => setActiveTab("usage")}>이용안내</Button>
                <Button className={`tab-button ${activeTab === "location" ? "active" : ""}`} onClick={() => setActiveTab("location")}>날씨/위치정보</Button>
                <Button className={`tab-button ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>캠핑&여행후기</Button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === "intro" && (
              <div id="intro">
                <div>
                  <p>{data.intro}</p>
                </div>
                  {/* 시설 아이콘 */}
                  <div>
                    <h2 className="camping-info-list"><ChevronRightIcon className="rightIcon"/> 캠핑장 시설 정보</h2>     
                      <div
                      className="camping-item-facilities"
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding :"20px 50px",
                        border : "1px solid #fff",
                        backgroundColor : "#f1f1f1",
                      }}
                    >             
                      {data.sbrsCl &&
                        data.sbrsCl.split(",").map((facility, idx) => {
                          switch (facility.trim()) {
                            case "운동시설":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <FitnessCenterIcon
                                    style={{ fontSize: "30px", color: "#3f51b5" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    운동시설
                                  </p>
                                </div>
                              );
                            case "전기":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <ElectricBoltIcon
                                    style={{
                                      fontSize: "30px",
                                      color: "#FADA7A",
                                    }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    전기
                                  </p>
                                </div>
                              );
                            case "무선인터넷":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Wifi
                                    style={{ fontSize: "30px", color: "#00bcd4" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    무선인터넷
                                  </p>
                                </div>
                              );
                            case "장작판매":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <ShoppingCart
                                    style={{ fontSize: "30px", color: "#8bc34a" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    장작판매
                                  </p>
                                </div>
                              );
                            case "온수":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <LocalFireDepartment
                                    style={{ fontSize: "30px", color: "#ff5722" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    온수
                                  </p>
                                </div>
                              );
                            case "트렘폴린":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <ChildCare
                                    style={{ fontSize: "30px", color: "#EE66A6" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    트렘폴린
                                  </p>
                                </div>
                              );
                            case "물놀이장":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Pool
                                    style={{ fontSize: "30px", color: "#009688" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    물놀이장
                                  </p>
                                </div>
                              );
                            case "놀이터":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <ChildCare
                                    style={{ fontSize: "30px", color: "#673ab7" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    놀이터
                                  </p>
                                </div>
                              );
                            case "산책로":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <HikingIcon
                                    style={{ fontSize: "30px", color: "#4caf50" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    산책로
                                  </p>
                                </div>
                              );
                            case "운동장":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <SportsSoccer
                                    style={{ fontSize: "30px", color: "#ff5722" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    운동장
                                  </p>
                                </div>
                              );
                            case "마트":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Store
                                    style={{ fontSize: "30px", color: "#9e9e9e" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    마트
                                  </p>
                                </div>
                              );
                            case "편의점":
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <Store
                                    style={{ fontSize: "30px", color: "#607d8b" }}
                                  />
                                  <p
                                    style={{
                                      marginTop: "5px",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    편의점
                                  </p>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                    </div>
                  </div>
                <div>
                <h2 className="camping-info-list"><ChevronRightIcon className="rightIcon"/> 기타 주요 시설</h2>
                      <div className="etc-table">
                        <table className="table">
                          <colgroup>
                            <col style={{width: "30%"}} />
                            <col style={{width: "70%"}} />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th scope="col">주요시설</th>
                              <td>
                                {facilityInfo.map((facility, index) => (
                                  <span key={index}>
                                  {facility.name}({facility.value}면)
                                  {index < facilityInfo.length - 1 && " ● "}
                                  </span>
                                ))}
                              </td>
                            </tr>
                            <tr>
                              <th scope="col">기타 부대시설</th>
                              <td>{data.tel}</td>
                            </tr>
                            <tr>
                              <th scope="col">{data.induty} 내부시설</th>
                              <td>{data.induty}</td>
                            </tr>
                            <tr>
                              <th scope="col">반려동물 출입</th>
                              <td>{data.operPdCl}</td>
                            </tr>
                            <tr>
                              <th scope="col">화로대</th>
                              <td>{data.operDeCl}</td>
                            </tr>
                            <tr>
                              <th scope="col">안전시설현황</th>
                              <td><a href={data.homepage} target="_BLANK" title="새창열림">홈페이지 바로가기</a></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                </div>
                <div>

                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div id="usage">
                <h2>이용안내</h2>
                <ul>
                  <li>예약은 온라인으로만 가능합니다.</li>
                  <li>체크인은 오후 3시, 체크아웃은 오전 11시입니다.</li>
                  <li>애완동물은 동반이 불가합니다.</li>
                </ul>
              </div>
            )}

            {activeTab === "location" && (
              <div id="location">
                <h2>날씨/위치정보</h2>
                <p>{data.addr1}</p>
                <p>카카오맵</p>
                <p>{data.direction}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div id="reviews">
                <h2>캠핑이용후기</h2>
                <p>후기가 없습니다. 첫 리뷰를 남겨보세요!</p>
              </div>
            )}

            {activeTab === "events" && (
              <div id="events">
                <h2>공지/이벤트</h2>
                <p>현재 진행 중인 이벤트가 없습니다.</p>
              </div>
            )}
          </div>
      
      </>
      ) : (
        <p>로딩 중...</p>
      )}
     
    </div>
  );
}