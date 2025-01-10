"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import ArticleIcon from "@mui/icons-material/Article";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { getCookie } from "cookies-next";
import axiosInstance from "@/app/utils/axiosInstance";
import Link from "next/link";

export default function MeetPage() {
  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/uploads";

  const router = useRouter();
  const params = useParams();
  const meetingId = params.id || "";

  const [meeting, setMeeting] = useState(null);
  const [members, setMembers] = useState([]);
  const [userIdx, setUserIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 가져오기
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      getUserIdx(token);
    }
  }, []);

  const getUserIdx = async (token) => {
    try {
      const response = await axiosInstance.get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUserIdx(response.data.data.user_idx);
      } else {
        router.push("/authentication/login");
      }
    } catch (error) {
      console.error("유저 정보 가져오기 실패:", error.message || error);
      router.push("/authentication/login");
    }
  };

  // 모임 상세 및 멤버 정보 가져오기
  const fetchMeetingDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/regular-meetings/detail/${meetingId}`,
        {
          params: { user_idx: userIdx },
        }
      );
      if (response.data) {
        setMeeting(response.data);
      } else {
        alert("모임 상세 정보를 불러오는 데 실패했습니다.");
        router.push("/admin/events/regular/view");
      }
    } catch (error) {
      console.error("모임 상세 정보 가져오기 실패:", error);
      alert("모임 상세 정보를 불러오는 데 실패했습니다.");
      router.push("/admin/events/regular/view");
    }
  };

  const fetchMeetingMembers = async () => {
    try {
      const response = await axiosInstance.get(
        `/regular-meetings/detail/${meetingId}/members`
      );
      if (response.data) {
        setMembers(response.data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("모임 멤버 정보 가져오기 실패:", error);
      setMembers([]);
    }
  };

  useEffect(() => {
    if (meetingId && userIdx) {
      fetchMeetingDetails();
      fetchMeetingMembers();
    }
  }, [meetingId, userIdx]);

  useEffect(() => {
    if (meeting !== null) {
      setLoading(false);
    }
  }, [meeting, members]);

  const handleDeleteMeeting = async () => {
    if (confirm("정말 모임을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/regular-meetings/delete/${meetingId}`);
        alert("모임이 삭제되었습니다.");
        router.push("/admin/events/regular/view");
      } catch (error) {
        console.error("모임 삭제 실패:", error);
        alert("모임 삭제 도중 오류가 발생했습니다.");
      }
    }
  };

  // 로딩 상태
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!meeting) {
    return <Typography>데이터 없음</Typography>;
  }

  // UI 렌더링
  return (
    <Box
      sx={{
        padding: "80px 40px",
        backgroundColor: "grey",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "600px",
          textAlign: "center",
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          모임 상세 정보
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>모임 ID</TableCell>
                <TableCell>{meeting.meeting_idx}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>모임 이름</TableCell>
                <TableCell>{meeting.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>리더</TableCell>
                <TableCell>{meeting.leader_username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>위치</TableCell>
                <TableCell>
                  {meeting.region} · {meeting.subregion}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>정원</TableCell>
                <TableCell>
                  {members.length} / {meeting.personnel}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>설명</TableCell>
                <TableCell>{meeting.description || "정보 없음"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            멤버 목록
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {members.map((member) => (
              <Grid item key={member.user_idx}>
                <Avatar
                  src={`${IMAGE_BASE_URL}/${member.avatar_url}`}
                  alt={member.username}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "1px solid #ddd",
                  }}
                />
                <Typography variant="body2" sx={{ marginTop: "5px" }}>
                  {member.username}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              router.push(
                `/admin/events/regular/detail/${meetingId}/bulletinboard`
              )
            }
          >
            게시판 보기
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
          marginTop="20px"
        >
          <Link href="/admin/events/regular/view" passHref>
            <Button variant="outlined" sx={{ mr: 2 }}>
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#D32F2F",
              color: "white",
              "&:hover": { backgroundColor: "#9A0007" },
            }}
            onClick={handleDeleteMeeting}
          >
            모임 삭제
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
