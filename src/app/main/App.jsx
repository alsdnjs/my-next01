"use client"; // Mark the component as a client-side component

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual"; // 필요한 스타일 추가
import { EffectFade, Navigation, Pagination, Autoplay, Virtual } from "swiper/modules";
import './styles.css';

export default function App() {
    // 상태 초기화
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [swiperRef, setSwiperRef] = useState(null);
    const appendNumber = useRef(500);
    const prependNumber = useRef(1);

    const regions = [
        "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
        "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도",
        "경상북도", "경상남도", "제주도"
    ];

    // Create array with 500 slides for new swiper
    const [slides, setSlides] = useState(
        Array.from({ length: 500 }).map((_, index) => `Slide ${index + 1}`)
    );

    // 컴포넌트가 마운트될 때 API 호출
    useEffect(() => {
        fetchData(); // 데이터 가져오는 함수 호출
    }, []);

    // API 호출 및 데이터 처리
    const fetchData = () => {
        fetch("https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json")
            .then(response => response.text()) // 응답을 텍스트로 읽어봄
            .then(text => {
                console.log(text); // 응답 내용 로그로 출력
                try {
                    const data = JSON.parse(text); // 응답이 JSON이라면 파싱
                    setData(data.response.body.items.item);
                    setFilteredData(data.response.body.items.item); // 초기에는 모든 데이터 표시
                } catch (error) {
                    console.error("Failed to parse JSON:", error); // JSON 파싱 오류 처리
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    // 검색 기능
    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = data.filter((item) => {
            const matchesRegion = selectedRegion ? item.addr1.includes(selectedRegion) : true;
            const matchesQuery = searchQuery ? item.facltNm.includes(searchQuery) : true;
            return matchesRegion && matchesQuery;
        });
        setFilteredData(filtered); // 필터링된 데이터 설정
    };

    // Prepend slides
    const prepend = () => {
        setSlides([
            `Slide ${prependNumber.current - 2}`,
            `Slide ${prependNumber.current - 1}`,
            ...slides,
        ]);
        prependNumber.current = prependNumber.current - 2;
        swiperRef.slideTo(swiperRef.activeIndex + 2, 0);
    };

    // Append slides
    const append = () => {
        setSlides([...slides, 'Slide ' + ++appendNumber.current]);
    };

    // Slide to specific index
    const slideTo = (index) => {
        swiperRef.slideTo(index - 1, 0);
    };

    return (
        <div>
            {/* 기존 캠핑장 슬라이드 */}
            <div className="slider-container">
                <Swiper
                    spaceBetween={30}
                    effect={'fade'}
                    navigation={true}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 4000, // 슬라이드 간격 4초 (단위: ms)
                        disableOnInteraction: false, // 유저와 상호작용 후에도 자동 슬라이드 유지
                    }}
                    modules={[EffectFade, Navigation, Pagination, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="Slide 1" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="Slide 2" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="https://swiperjs.com/demos/images/nature-3.jpg" alt="Slide 3" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="https://swiperjs.com/demos/images/nature-4.jpg" alt="Slide 4" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="search-input"
                />
                <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="region-select"
                >
                    <option value="">지역 선택</option>
                    {regions.map((region, i) => (
                        <option key={i} value={region}>
                            {region}
                        </option>
                    ))}
                </select>
                <button type="submit" className="search-button">
                    검색
                </button>
            </form>

            {/* 캠핑장 데이터 목록 */}
            <div className="camping-list">
                {filteredData && filteredData.map((item, index) => (
                    <div key={index} className="camping-item">
                        <img src={item.firstImageUrl} alt={item.facltNm} style={{ height: '300px', objectFit: 'cover' }} />
                        <h1>{item.facltNm}</h1>
                        <p>주소: {item.addr1}</p>
                        <p>전화번호: {item.tel}</p>
                    </div>
                ))}
            </div>

            {/* 새로운 스와이프 */}
            <div className="new-swiper-container">
                <Swiper
                    modules={[Virtual, Navigation, Pagination]}
                    onSwiper={setSwiperRef}
                    slidesPerView={3}
                    centeredSlides={true}
                    spaceBetween={30}
                    pagination={{
                        type: 'fraction',
                    }}
                    navigation={true}
                    virtual
                >
                    {filteredData && filteredData.map((item, index) => (
                        <SwiperSlide key={item.facltNm} virtualIndex={index}>
                            <div className="camping-slide">
                                <img src={item.firstImageUrl} alt={item.facltNm} style={{ height: '200px', objectFit: 'cover' }} />
                                <h3>{item.facltNm}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="append-buttons">
                    <button onClick={() => prepend()} className="prepend-2-slides">
                        Prepend 2 Slides
                    </button>
                    <button onClick={() => slideTo(1)} className="prepend-slide">
                        Slide 1
                    </button>
                    <button onClick={() => slideTo(250)} className="slide-250">
                        Slide 250
                    </button>
                    <button onClick={() => slideTo(500)} className="slide-500">
                        Slide 500
                    </button>
                    <button onClick={() => append()} className="append-slides">
                        Append Slide
                    </button>
                </div>
            </div>
        </div>
    );
}
