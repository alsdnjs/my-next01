"use client"; // Mark the component as a client-side component

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual"; // 필요한 스타일 추가
import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded'; // 카테고리 아이콘
import DeckIcon from '@mui/icons-material/Deck'; // 카테고리 아이콘
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // 카테고리 아이콘
import FestivalIcon from '@mui/icons-material/Festival'; // 카테고리 아이콘
import { EffectFade, Navigation, Pagination, Autoplay, Virtual } from "swiper/modules";
import './styles.css';

export default function App() {
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState(''); // 지역 선택 상태
    const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태
    const [swiperRef, setSwiperRef] = useState(null);
    const [showNavigation, setShowNavigation] = useState(false); // 네비게이션 버튼 상태
    const appendNumber = useRef(500);
    const prependNumber = useRef(1);

    const regions = [
        "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
        "경기도", "강원", "충북", "충남", "전라북도", "전라남도",
        "경상북도", "경상남도", "제주도"
    ];

    const categories = [
        "카라반", "일반야영장", "자동차야영장", "글램핑"
    ];

    const [slides, setSlides] = useState(
        Array.from({ length: 500 }).map((_, index) => `Slide ${index + 1}`)
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json")
            .then(response => response.text())
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    setData(data.response.body.items.item);
                    setFilteredData(data.response.body.items.item);
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = data.filter((item) => {
            const matchesRegion = selectedRegion ? item.addr1.includes(selectedRegion) : true;
            const matchesQuery = searchQuery ? item.facltNm.includes(searchQuery) : true;
            return matchesRegion && matchesQuery;
        });
        setFilteredData(filtered);
    };

    const handleCategoryClick = (category) => {
        if (category === "카라반") {
            const filtered = data.filter((item) => item.facltNm.includes(category) || item.addr1.includes(category));
            setFilteredData(filtered);
        } else {
            const filtered = data.filter((item) => item.facltNm.includes(category));
            setFilteredData(filtered);
        }
    };

    const prepend = () => {
        setSlides([ 
            `Slide ${prependNumber.current - 2}`,
            `Slide ${prependNumber.current - 1}`,
            ...slides,
        ]);
        prependNumber.current = prependNumber.current - 2;
        swiperRef.slideTo(swiperRef.activeIndex + 2, 0);
    };

    const append = () => {
        setSlides([...slides, 'Slide ' + ++appendNumber.current]);
    };

    const slideTo = (index) => {
        swiperRef.slideTo(index - 1, 0);
    };

    return (
        <div>
            <div className="slider-container">
                <Swiper
                    spaceBetween={30}
                    effect={'fade'}
                    navigation={true}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    modules={[EffectFade, Navigation, Pagination, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="./images/cam1.webp" alt="Slide 1" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="./images/cam1.webp"  alt="Slide 2" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="slide-content">
                            <img src="./images/cam1.webp"  alt="Slide 3" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

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

            <div className="category-container">
                {categories.map((category, index) => (
                    <button 
                        key={index} 
                        className="category-button" 
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category === "카라반" ? (
                            <AirportShuttleRoundedIcon style={{ marginRight: "5px" }} />
                        ) : category === "일반야영장" ? (  // '일반야영장'에 아이콘 
                            <DeckIcon style={{ marginRight: "5px" }} />
                        ) : category === "자동차야영장" ? ( // '자동차야영장'에 LocalShippingIcon 
                            <LocalShippingIcon style={{ marginRight: "5px" }} />
                        ) : category === "글램핑" ? ( // '글램핑'에 FestivalIcon 
                            <FestivalIcon style={{ marginRight: "5px" }} />
                        ) : null}
                        {category}
                    </button>
                ))}
            </div>

            {/* 아래 스와이프 */}
            <div
                className="new-swiper-container"
                onMouseEnter={() => setShowNavigation(true)} // 마우스 진입 시 버튼 표시
                onMouseLeave={() => setShowNavigation(false)} // 마우스 나가면 버튼 숨김
            >
                <div className="month-text">12월 추천 캠핑장 !</div> {/* 텍스트 추가 */}
                <Swiper
                    modules={[Virtual, Navigation, Pagination]}
                    onSwiper={setSwiperRef}
                    slidesPerView={3}
                    centeredSlides={true}
                    spaceBetween={1}
                    pagination={{
                        type: 'fraction',
                    }}
                    navigation={showNavigation} // 상태에 따라 네비게이션 활성화
                    virtual
                >
                    {filteredData && filteredData.map((item, index) => (
                        <SwiperSlide key={item.facltNm} virtualIndex={index}>
                            <div className="camping-slide">
                                <img
                                    src={item.firstImageUrl}
                                    alt={item.facltNm}
                                    className="camping-image" // 클래스 이름 추가
                                />
                                <div className="image-overlay"></div>
                                <h3>{item.facltNm}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="camping-list">
                    {filteredData && filteredData.map((item, index) => (
                        <div key={index} className="camping-item">
                            <img src={item.firstImageUrl} alt={item.facltNm} style={{ height: '300px', objectFit: 'cover' }} />
                            <h1>{item.facltNm}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
