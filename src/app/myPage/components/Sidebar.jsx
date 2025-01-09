"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {Box, Typography, List, ListItem, ListItemText, ListItemIcon, Badge, Avatar, Divider} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState("회원정보");
  const [isSticky, setIsSticky] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);

    // 일정 위치에서 사이드바가 따라 내려오도록 설정
    if (currentScrollY > 200) { // 200px 이상 스크롤 시
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  const handleMenuClick = (path, name) => {
    router.push(path);
    setSelectedMenu(name);
    console.log(path);
    console.log(pathname);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuSections = [
    {
      title: "Main",
      items: [
        { name: "회원정보", path: "/myPage/myUserInfo", icon: <WorkIcon /> },
        { name: "내가 찜한 캠핑장", path: "/myPage/myCampSites", icon: <HomeIcon /> },
        { name: "예약/이용 내역", path: "/myPage/myHistory", icon: <WorkIcon /> },
        { name: "1대1문의", path: "/myPage/myInquiryHistory", icon: <PeopleIcon /> },
        { name: "내가 찜한 모임", path: "/myPage/myFavoriteMeetings", icon: <PeopleIcon /> },
        { name: "내가 작성한 리뷰", path: "/myPage/myReviews", icon: <PeopleIcon /> },
      ]
    }
  ]
  return (
    <Box
      sx={{
        width: "260px",
        minWidth: "260px",
        backgroundColor: "#F8F9FA",
        borderRadius: "15px 0 0 15px",
        padding: 2,
        zIndex: 10,
        height: 'full',
        transition: 'top 0.3s ease', // 부드러운 애니메이션 효과
      }}
    >
      <Typography variant="h6" fontWeight="bold" marginBottom="20px">
        My Page
      </Typography>

      {menuSections.map((section, index) => (
        <Box key={index} marginBottom="20px">
          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
            marginBottom="10px"
          >
            {section.title}
          </Typography>
          <List>
            {section.items.map((item) => (
              <ListItem
                key={item.path}
                sx={{
                  borderRadius: "10px",
                  backgroundColor:
                    pathname === item.path ? "#a1eb81" : "transparent",
                  color: pathname === item.path ? "#FFFFFF" : "#333333",
                  marginBottom: "5px",
                  "&:hover": {
                    backgroundColor: pathname === item.path
                      ? "#59e61c"
                      : "#E9ECEF",
                  },
                }}
                onClick={() => handleMenuClick(item.path, item.name)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    color: router.pathname === item.path ? "#FFFFFF" : "#6C757D",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    color="primary"
                    sx={{ marginLeft: "auto" }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      ))}

      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar src="" alt="Jane Doe" sx={{ marginRight: "10px" }} />
        <Box>
          <Typography variant="body1" fontWeight="bold">
            Jane Doe
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Maintenance Lead
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
  