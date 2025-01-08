"use client"
import { Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import InputForm from "../../../component/InputForm"
import { useState } from "react";

function EmailVerificationForm({
    email,
    verificationCode,
    verificationSent,
    emailVerified,
    countdown,
    handleEmailChange,
    handleVerificationCodeChange,
    sendVerificationCode,
    verifyCode,
}){


    return(
        <Box
            sx={{
                background: "#fff",
                padding: "30px 20px",
                borderRadius: "10px",
                maxWidth: "510px",
            }}
            className="bg-black"
        >
            <Grid container alignItems="center" spacing={2}>
                <InputForm
                    label="이메일"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={emailVerified || verificationSent}
                    endAdornment="인증번호 발송"
                    onClick={sendVerificationCode}
                />
                <InputForm
                    label="인증 코드"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={handleVerificationCodeChange}
                    display={verificationSent ? "" : "none"}
                    endAdornment="인증하기"
                    onClick={verifyCode}
                    disabled={emailVerified}
                    buttonDisabled={emailVerified}
                />
                <Typography color="textSecondary" sx={{ mt: 3, ml: 3 }}>
                    {emailVerified
                        ? '인증 완료되었습니다.'
                        : verificationSent
                        ? `인증 코드가 이메일로 발송되었습니다. 남은 시간: ${Math.floor(countdown / 60)}:${countdown % 60}`
                        : null}
                </Typography>
            </Grid>
        </Box>
    )
}


export default EmailVerificationForm;