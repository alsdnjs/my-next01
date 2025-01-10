"use client"
import React, { useState } from "react";
import { Button, TextField, Box, Typography, Container, Alert, Grid } from "@mui/material";
import InputForm from "../../component/InputForm";
import useEmailVerification from "../signUp/hooks/useEmailVerification";
import EmailVerificationForm from "../signUp/components/EmailVerificaionForm";
import useAuthStore from "../../../../store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FindIdAndPasswordPage() {
  const emailVerification = useEmailVerification();
  const [step, setStep] = useState(1); // 1: 아이디 입력 단계, 2: 이메일 인증 단계
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [data, setData] = useState();
  const [id, setId] = useState();
  const router = useRouter();

  const handleFindId = () => {
    if (!emailVerification.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    getId();
  };


  
  const idCheck = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/users/idCheck`;
    try {
      const response = await axios.get(API_URL, {
        params: { id: id }, // 쿼리 파라미터 전달
      })
      console.log(response);
      
      if(!response.data.success){
        
        setStep(2);
      } else {
        alert("존재하지 않는 아이디입니다.");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getTemporaryPassword = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/signup/sendTemporaryPassword`;

    try {
      const response = await axios.post(API_URL,{id:id, email:emailVerification.email} , {
        params: {
          id: id,
          email: emailVerification.email
        }, // 쿼리 파라미터 전달
      })
      if(response.data.success){
        const password = response.data.data;
        setData(password);
        alert(password);
        console.log(password);
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
          display: "flex", flexDirection: "column", alignItems: "center",
          marginTop: 5, padding: 3, minWidth:"400px",
          border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" gutterBottom>
          비밀번호 찾기
        </Typography>
        {step === 1 && (<>
        <Box
          sx={{
              background: "#fff",
              padding: "10px 20px 0px",
              borderRadius: "10px",
              minWidth: "360px",
          }}
          className="bg-black"
        >
          <Grid container alignItems="center" spacing={2}>
            <InputForm
              label="아이디"
              name="id"
              value={id}
              onChange={(e) => {setId(e.target.value)}}
            />
          </Grid>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={idCheck} // 다음 단계로 이동
          disabled={!id} // 아이디가 입력되지 않으면 비활성화
        >
          다음 단계
        </Button></>)}

        {step === 2 && (
          // 이메일 인증 단계
          <>
            <EmailVerificationForm {...emailVerification} />

            {/* 비밀번호 찾기 버튼 */}
            <Button
              variant="contained"
              color="primary"
              disabled={!emailVerification.emailVerified}
              fullWidth
              onClick={getTemporaryPassword}
              sx={{ marginTop: 2 }}
            >
              비밀번호 찾기
            </Button>

            {/* 뒤로 가기 버튼 */}
            <Button
              variant="outlined"
              fullWidth
              sx={{ marginTop: 1 }}
              onClick={() => setStep(1)}
            >
              뒤로 가기
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}