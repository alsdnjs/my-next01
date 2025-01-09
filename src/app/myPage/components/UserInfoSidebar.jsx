"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {Box, Typography, List, ListItem, ListItemText, ListItemIcon, Badge, Avatar, Divider} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import MyUserInfo from "../myUserInfo/page";
import axios from "axios";
import useAuthStore from "../../../../store/authStore";

const Sidebar = () => {
  const {token} = useAuthStore();  // zustand에서 token 값 가져오기
  const router = useRouter();
  const [data, setData] = useState();
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL


  const getMyMeetings = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/myPage/getMyMeeyings`;
    const response = await axios.get(API_URL, { 
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // JSON 형식 명시
        }
    })
    if(response.data.success){
      setData(response.data.data);
      console.log(response.data.data);
    }

  }

  useEffect(() => {
    getMyMeetings();
  }, [token]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        minWidth:"200px",
        backgroundColor: "#F8F9FA",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >


      <Typography variant="h6" sx={{fontWeight:"bold", mb:"20px", mt:"20px"}}>
        내 모임
      </Typography>
    {data && data.length > 0 ? data.map((data, index) => (
      <Box key={index} sx={{
        padding:"10px",
        display:"flex",
        minWidth:"200px",
        alignItems:"center",
        justifyContent: "center",
        backgroundColor:"white",
        border:"1px solid #F8F9FA",
        borderRadius:"10px",
        margin:"5px"
      }}>
        <Avatar src="" alt="Jane Doe" sx={{ marginRight: "10px" }} />
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Maintenance Lead
          </Typography>
        </Box>
      </Box>
    )) : (
      <Typography>
        가입된 모임이 없습니다.
      </Typography>
    )}
  </Box>
  );
};

export default Sidebar;
  