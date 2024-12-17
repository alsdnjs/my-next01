"use client"
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

function MyUserInfo(props) {
  const router = useRouter();
  // 회원 정보 (예시)
  const userInfo = {
    name: '홍길동',
    nickname: '길동이',
    userId: 'honggildong123',
    profileImage: 'https://www.example.com/profile.jpg' // 프로필 이미지 URL
  };

  const handleModifyClick = () => {
    router.push("/myPage/myUserInfo/passwordCheck");  // 회원가입 페이지로 이동
  };
  return (
    <Container maxWidth="sm"
        sx={{
          marginTop: "50px",
          marginRight:"auto",
          marginLeft:"auto"
        }}>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        {/* 프로필 사진 */}
        <Avatar
          alt="Profile Image"
          src={userInfo.profileImage}
          sx={{ width: 120, height: 120, margin: '0 auto' }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        {/* 이름 */}
        <Typography variant="h5" gutterBottom>
          {userInfo.name}
        </Typography>
        {/* 닉네임 */}
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {userInfo.nickname}
        </Typography>
        {/* 아이디 */}
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {userInfo.userId}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        {/* 회원정보 수정 버튼 */}
        <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: 2 }} onClick={handleModifyClick}>
          회원정보 수정
        </Button>
        {/* 회원 탈퇴하기 버튼 */}
        <Button variant="outlined" color="error" fullWidth >
          회원 탈퇴하기
        </Button>
      </Box>
    </Container>
  );
};

export default MyUserInfo;
