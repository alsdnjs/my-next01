"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  MenuItem,
  Link,
  TextField,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import ForestIcon from "@mui/icons-material/Forest";
import SearchIcon from "@mui/icons-material/Search"; // 돋보기 아이콘 임포트

const Header = () => {
  const isSmallScreen = useMediaQuery("(max-width:1000px)");

  // 하위 메뉴 상태 관리
  const [openAllMenus, setOpenAllMenus] = useState(false); // 모든 메뉴 열기/닫기 상태

  // 상위 메뉴에 마우스를 올렸을 때 큰 메뉴 열기
  const handleMouseEnter = () => {
    setOpenAllMenus(true);
  };

  const handleMouseLeave = () => {
    setOpenAllMenus(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* 상단 툴바 - 로그인, 회원가입, 마이페이지 */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#f8f8f8",
          height: "35px",
          width: "100%",
          boxShadow: "none",
          borderBottom: "0.5px solid rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "25px",
              marginRight: "50px",
            }}
          >
            <Link
              href="/signup"
              sx={{
                fontSize: "0.9rem",
                color: "#3C3D37",
                textDecoration: "none",
              }}
            >
              회원가입
            </Link>
            <Link
              href="/login"
              sx={{
                fontSize: "0.9rem",
                color: "#3C3D37",
                textDecoration: "none",
              }}
            >
              로그인
            </Link>
            <Link
              href="/mypage"
              sx={{
                fontSize: "0.9rem",
                color: "#3C3D37",
                textDecoration: "none",
              }}
            >
              마이페이지
            </Link>
            <Link
              href="/" // 고객센터 링크
              sx={{
                fontSize: "0.9rem",
                color: "#3C3D37",
                textDecoration: "none",
              }}
            >
              공지사항
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 경빈이네 캠핑 툴바와 검색바 */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          height: "100px", // 툴바 높이 설정
          width: "100%",
          borderBottom: "0.5px solid rgba(0, 0, 0, 0.2)",
          position: "relative", // 검색바와 함께 정렬 가능
        }}
      >
        <Toolbar sx={{ position: "relative", height: "100%" }}>
          {/* 경빈이네 캠핑을 화면 가운데에 배치 */}
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ForestIcon sx={{ fontSize: 40, color: "#597445", mr: 1 }} />
            <Typography variant="h5" sx={{ color: "#597445", fontWeight: "bold" }}>
              경빈이네 캠핑
            </Typography>
          </Box>

          {/* 검색창 */}
          {!isSmallScreen && (
            <Box sx={{ position: "absolute", right: 50, top: "25px", width: "200px", 
            marginRight : "150px", backgroundColor: "#f8f8f8"}}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="검색어를 입력하세요"
                sx={{ borderRadius: "5px"}}
              />
            </Box>
          )}

          {/* 돋보기 아이콘 */}
          {!isSmallScreen && (
            <Box sx={{ position: "absolute", right: 10, top: "25px", marginRight : "150px" }}>
              <IconButton>
                <SearchIcon sx={{ color: "#597445", fontWeight: "bold"}} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 메뉴 - 고객센터, 캠핑장, 함께해요 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          bgcolor: "white",
          paddingTop: "10px", // 두 툴바를 고려한 공간 확보
          paddingBottom: "10px",

        }}
      >
        <Box
          sx={{
            display: "inline-block",
            cursor: "pointer",
            width: "20%", // 메뉴의 3개 항목이 화면 60% 차지
            textAlign: "center", // 메뉴 항목을 가운데 정렬
            
          }}
          onMouseEnter={handleMouseEnter} // 하나라도 마우스를 올리면 모든 하위 메뉴 표시
          onMouseLeave={handleMouseLeave} // 마우스가 떨어지면 모든 하위 메뉴 닫기
        >
          
          <Button
            sx={{
              color: "black",
              textDecoration: "none",
              fontSize: "1rem",
              backgroundColor: "transparent",
              width: "100%",
            }}
          >
            캠핑GO
          </Button>
          
          {openAllMenus && (
            <Box sx={{ display: "flex", flexDirection: "column", 
            padding: "10px" , textAlign: "center", 
            justifyContent: "center", alignItems: "center", paddingTop: "30px",
            }}>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>캠핑장 검색</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem" }}>지도로 검색</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>12월! 여기서 캠핑 어때?</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>나의 예약</MenuItem>
              </Link>
            </Box>
          )}
        </Box>

        

        <Box
          sx={{
            display: "inline-block",
            cursor: "pointer",
            width: "20%",
            textAlign: "center",
          }}
          onMouseEnter={handleMouseEnter} // 하나라도 마우스를 올리면 모든 하위 메뉴 표시
          onMouseLeave={handleMouseLeave} // 마우스가 떨어지면 모든 하위 메뉴 닫기
        >
          <Button
            sx={{
              color: "black",
              textDecoration: "none",
              fontSize: "1rem",
              backgroundColor: "transparent",
              width: "100%",
            }}
          >
            함께해요
          </Button>
          {openAllMenus && (
            <Box sx={{ display: "flex", flexDirection: "column", 
              padding: "10px" , textAlign: "center", 
              justifyContent: "center", alignItems: "center", paddingTop: "30px"}}>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>모임 찾기</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>모임 생성</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>나의 모임</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>번개 모임</MenuItem>
              </Link>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "inline-block",
            cursor: "pointer",
            width: "20%",
            textAlign: "center",
            
          }}
          onMouseEnter={handleMouseEnter} // 하나라도 마우스를 올리면 모든 하위 메뉴 표시
          onMouseLeave={handleMouseLeave} // 마우스가 떨어지면 모든 하위 메뉴 닫기
        >
          <Button
            sx={{
              color: "black",
              textDecoration: "none",
              fontSize: "1rem",
              backgroundColor: "transparent",
              width: "100%",
              
            }}
          >
            고객센터
          </Button>
          {openAllMenus && (
            <Box sx={{ display: "flex", flexDirection: "column", 
              padding: "10px" , textAlign: "center", 
              justifyContent: "center", alignItems: "center", paddingTop: "30px"
            }}>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>공지사항</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>자주 묻는 질문</MenuItem>
              </Link>
              <Link href="/" sx={{ textDecoration: "none"}}>
                <MenuItem sx={{color: "#3C3D37", fontSize: "0.9rem"}}>1:1 문의</MenuItem>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "1px", 
          position: "absolute",
          top: "194px",
          bgcolor: "rgba(0, 0, 0, 0.2)", // 선 색상
        }}
      />
    </Box>
  );
};

export default Header;
