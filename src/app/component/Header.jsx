"use client";
import React from "react";
import { AppBar, Toolbar, Typography, Box, Link, TextField, InputAdornment } from "@mui/material";
import ForestIcon from "@mui/icons-material/Forest";
import SearchIcon from "@mui/icons-material/Search";  // 검색 아이콘 추가
import { useMediaQuery } from "@mui/material";

export default function Header() {
  // 화면 크기 체크 (1000px 이하에서 텍스트 숨기기)
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* 상단 툴바 - 로그인, 회원가입, 마이페이지 */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#f8f8f8",
          height: "30px",
          width: "100%",
          boxShadow: "none",
          borderBottom: "0.5px solid rgba(0, 0, 0, 0.2)"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
          {/* 오른쪽 - 로그인, 회원가입, 마이페이지 링크 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px", 
            marginBottom: "35px", marginRight: "50px" }}>
            <Link
              href="/signup"
              sx={{
                fontSize: "0.9rem",
                color: "black", // 글자 색 검정색으로 설정
                textDecoration: "none",
              }}
            >
              회원가입
            </Link>
            <Link
              href="/login"
              sx={{
                fontSize: "0.9rem",
                color: "black", // 글자 색 검정색으로 설정
                textDecoration: "none",
              }}
            >
              로그인
            </Link>
            <Link
              href="/mypage"
              sx={{
                fontSize: "0.9rem",
                color: "black", // 글자 색 검정색으로 설정
                textDecoration: "none",
              }}
            >
              마이페이지
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 경빈이네 캠핑 툴바 */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          height: "100px", // 툴바 높이 설정
          width: "100%",
          borderBottom: "0.5px solid rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
  <ForestIcon sx={{ fontSize: 40, color: "#597445", mr: 1 }} />
  {/* 화면 크기가 1000px 이하일 때 텍스트 숨기기 */}
  {!isSmallScreen && (
    <Typography variant="h5" sx={{ color: "#597445", fontWeight: "bold" }}>
      경빈이네 캠핑
    </Typography>
  )}
</Box>

          {/* 검색 바 추가 */}
          <Box sx={{ display: "flex", alignItems: "center", marginRight: "50px" }}>
            <TextField
              variant="outlined"
              size="small"
              sx={{ width: "200px" }}
              placeholder="검색어를 입력하세요"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "gray" }} />
                  </InputAdornment>
                ),
                inputProps: {
                    style: {
                        fontSize: "0.8rem",
                    }
                }
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메뉴 - 고객센터, 캠핑장, 함께해요 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "white",
          paddingTop: "20px", // 두 툴바를 고려한 공간 확보
          paddingBottom: "20px",
        }}
      >
        {["캠핑GO", "캠핑플러스", "고객센터"].map((menu) => (
          <Box
            key={menu}
            sx={{
              display: "inline-block",
              cursor: "pointer",
              width: "33.33%", // 메뉴의 3개 항목이 화면 70% 차지
              textAlign: "center", // 메뉴 항목을 가운데 정렬
            }}
          >
            <Typography sx={{ color: "black" }}>
              {menu}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
