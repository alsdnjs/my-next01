"use client"
import React, { useState } from "react";
import { Button, TextField, Box, Typography, Container, Alert } from "@mui/material";
import InputForm from "../../component/InputForm";
import useEmailVerification from "../signUp/hooks/useEmailVerification";
import EmailVerificationForm from "../signUp/components/EmailVerificaionForm";
import useAuthStore from "../../../../store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FindIdAndPasswordPage() {
  const emailVerification = useEmailVerification();
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [data, setData] = useState();
  const router = useRouter();

  const handleFindId = () => {
    if (!emailVerification.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    getId();
  };
  
  const getId = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/users/getForgotId`;
    try {
      const response = await axios.post(API_URL, emailVerification.email, {
        params: { email: emailVerification.email }, // 쿼리 파라미터 전달
      })
      if(response.data.success){
        const id = response.data.data;
        setData(id);
        alert(id);
        console.log(id);
        router.push('/authentication/login');
      }
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <Container maxWidth="xs" sx={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center", marginTop: 5, padding: 3, minWidth:"500px",
          border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", mr:"50px"
        }}
      >
        <Typography variant="h5" gutterBottom>
          아이디 찾기
        </Typography>

        <EmailVerificationForm {...emailVerification}/>


        {/* 비밀번호 찾기 버튼 */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFindId}
          disabled={!emailVerification.emailVerified}
          sx={{ marginTop: 2 }}
        >
          아이디 찾기
        </Button>

        {/* 뒤로 가기 버튼 */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={() => window.history.back()}
        >
          뒤로 가기
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center", marginTop: 5, padding: 3, minWidth:"500px",
          border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" gutterBottom>
          비밀번호 찾기
        </Typography>

        <EmailVerificationForm {...emailVerification}/>


        {/* 비밀번호 찾기 버튼 */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFindId}
          disabled={!emailVerification.emailVerified}
          sx={{ marginTop: 2 }}
        >
          비밀번호 찾기
        </Button>

        {/* 뒤로 가기 버튼 */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={() => window.history.back()}
        >
          뒤로 가기
        </Button>
      </Box>
    </Container>
  );
}