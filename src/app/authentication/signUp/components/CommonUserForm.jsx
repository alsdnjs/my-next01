"use client"
import React, { useEffect, useState } from 'react';
import useSignup from '../hooks/useSignUP';
import { Box, Button, Checkbox, Collapse, FormControlLabel, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import FormSwitcher from './FormSwitcher';
import useEmailVerification from '../hooks/useEmailVerification';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import InputForm from '../../../component/InputForm';

function CommonUserForm(props) {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const {
    mId, mPw, mPwConfirm, name, phone, 
    zipcode, address, addressDetail, error, agreed, idStatus, 
    handleIdChange, handlePwChange, handleMPwConfirmChange, handleNameChange, handlePhoneChange,
    handleEmailChange, handleZipcodeChange, handleAddressChange, handleAddressDetailChange,
    handleAgreeChange, handleVerificationCodeChange,
    setError, setVerificationSent, setEmailVerified, setIdStatus
  } = useSignup(LOCAL_API_BASE_URL);

  // 이메일 커스텀 훅
  const {
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    verificationSent,
    sendVerificationCode,
    emailVerified,
    verifyCode,
    countdown,
  } = useEmailVerification();

  //handle
  const handlePostCode = () => {
    // 카카오 주소 검색 팝업 실행
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 도로명 주소와 우편번호 저장
        setZipcode(data.zonecode);
        setAddress(data.address);
      },
    }).open(); // 팝업 열기
  };

  const [openTerms, setOpenTerms] = useState({ term1: false, term2: false });


  // 회원가입 버튼 클릭 처리
  const handleSignup = () => {
    if (!mId || !mPw || !mPwConfirm || !name || !phone || !email || !zipcode || !address || !addressDetail) {
      setError("모든 필드를 입력하세요.");
      return;
    }
    if(!idStatus){
      setError("이미 사용중인 아이디입니다.");
    }
    if (mPw !== mPwConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }
    if (!agreed) {
      setError("약관에 동의해야 회원가입이 가능합니다.");
      return;
    }

    // 회원가입 로직 추가 (예: 서버에 데이터 전송)
    console.log("회원가입 성공:", { mId, mPw, name, phone, email, zipcode, address, addressDetail });

    // 회원가입 성공 후 로그인 페이지로 이동
    router.push("/login");
  };


  return (
    <div className="authenticationBox">

    <Box
      component="main"  
      sx={{
        maxWidth: "510px",
        ml: "auto",
        mr: "auto",
        padding: "50px 0 100px",
      }}
    >
      <Grid item xs={12} md={12} lg={12} xl={12}>
        <Box>
          {/* 페이지 제목 */}
          <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
            Get’s started.{" "} 
            <img
              src="/images/favicon.png" //메인 이미지
              alt="favicon"
              // className={styles.favicon}
            />
          </Typography>

          <FormSwitcher/>
          <Box noValidate>
            <Box
              sx={{
                background: "#fff",
                padding: "30px 20px",
                borderRadius: "10px",
                mb: "20px",
              }}
              className="bg-black"
            >
              <Grid container alignItems="center" spacing={2}>
                {/* 입력 필드 */}
                <InputForm
                  label="아이디"
                  name="id"
                  value={mId}
                  onChange={handleIdChange}
                />
                {/* 아이디 중복확인 */}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, ml: 3 }}>
                  {idStatus.message}
                </Typography>
                <InputForm
                  label="비밀번호"
                  type="password"
                  name="pw"
                  value={mPw}
                  onChange={handlePwChange}
                />
                <InputForm
                  label="비밀번호 확인"
                  type="password"
                  name="pwChk"
                  value={mPwConfirm}
                  onChange={handleMPwConfirmChange}
                />

                 {/* 비밀번호 일치 확인 */}
                {/* InputForm(label, type, name, value, onChange) */}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, ml: 3 }}>
                  {mPwConfirm == "" ?  "" : (passwordCheck ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.")}
                </Typography>
              </Grid>
            </Box>
            <Box 
              sx={{
                background: "#fff",
                padding: "30px 20px",
                borderRadius: "10px",
                mb: "20px",
              }}
              className="bg-black"
            >
              <Grid container alignItems="center" spacing={2}>
                <InputForm
                  label="이름" 
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                />
                <InputForm
                  label="휴대폰번호"
                  name="phone1"
                  value={phone}
                  onChange={handlePhoneChange}
                  xs={12}
                />
                  {/* <Button
                    xs={4}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => setPhoneVerified(true)}
                  >
                    휴대폰 인증하기
                  </Button> */}
              </Grid>
            </Box>
            <Box
              sx={{
                background: "#fff",
                padding: "30px 20px",
                borderRadius: "10px",
                mb: "20px",
              }}
              className="bg-black"
            >
              <Grid container alignItems="center" spacing={2}>
                <InputForm
                  label="이메일"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={emailVerified}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "16px",
                    ml:"20px",
                    mr:"2px",
                    padding: "10px 10px",
                    color: "#fff !important",
                  }}
                  onClick={sendVerificationCode}
                  disabled={emailVerified}
                >
                인증번호 보내기
                </Button>
                <InputForm
                  label="인증 코드"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "16px",
                    ml:"20px",
                    mr:"2px",
                    padding: "10px 10px",
                    color: "#fff !important",
                  }}
                  onClick={verifyCode}
                  disabled={emailVerified}
                >
                  인증번호 확인
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 3, ml: 3 }}>
                  {emailVerified
                    ? '인증 완료되었습니다.'
                    : verificationSent
                    ? `인증 코드가 이메일로 발송되었습니다. 남은 시간: ${Math.floor(countdown / 60)}:${countdown % 60}`
                    : null}
                </Typography>
              
              </Grid>
            
            </Box>            
            <Box
              sx={{
                background: "#fff",
                padding: "30px 20px",
                borderRadius: "10px",
                mb: "20px",
              }}
              className="bg-black"
            >
            <Grid container alignItems="center" spacing={2}>
              <InputForm 
                label="우편번호"
                name="zipcode"
                value={zipcode}
                onChange={handleZipcodeChange}
                disabled
              />
            </Grid>
          
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                textTransform: "capitalize",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "16px",
                mr:"2px",
                padding: "10px 10px",
                color: "#fff !important",
              }}
              onClick={handlePostCode}
            >
              우편번호 검색
            </Button>
            <Grid container alignItems="center" spacing={2}>
              <InputForm 
                label="주소"
                value={address}
                onChange={handleAddressChange}
                disabled
              />
              <InputForm 
                label="상세주소"
                value={addressDetail}
                onChange={handleAddressDetailChange}
              />
            </Grid>
          </Box>
        </Box>

        {/* 약관 목록 */}
        <Box
          sx={{
            background: "#fff",
            padding: "30px 20px",
            borderRadius: "10px",
            mb: "20px",
          }}
          className="bg-black"
        >
          <Box
            sx={{
              width: "auto",
              margin: 0,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: 1
            }}
          >
            <Typography variant="subtitle1">약관</Typography>
            <List>
              {/* 약관 1 */}
              <ListItem button onClick={() => toggleTerm("term1")}>
                <ListItemText primary="이용약관" />
                {openTerms.term1 ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openTerms.term1} timeout="auto" unmountOnExit>
                <Box sx={{ padding: 2, backgroundColor: "#f1f1f1", borderRadius: "4px" }}>
                  <Typography variant="body2">
                    이 약관은 사용자가 서비스를 이용함에 있어 필요한 조건과 규정을 담고 있습니다.
                  </Typography>
                </Box>
              </Collapse> 

              {/* 약관 2 */}
              <ListItem button onClick={() => toggleTerm("term2")}>
                <ListItemText primary="개인정보 처리방침" />
                {openTerms.term2 ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openTerms.term2} timeout="auto" unmountOnExit>
                <Box sx={{ padding: 2, backgroundColor: "#f1f1f1", borderRadius: "4px" }}>
                  <Typography variant="body2">
                    개인정보는 안전하게 보호되며, 법적 요건에 따라 처리됩니다.
                  </Typography>
                </Box>
              </Collapse>
            </List>
          </Box>

          {/* 약관 동의 */}
          <FormControlLabel
            control={<Checkbox checked={agreed} onChange={handleAgreeChange} />}
            label={<Typography variant="body2">회원가입 약관에 동의합니다.</Typography>}
            sx={{ marginTop: 2, alignSelf: "flex-start" }}
          />

          {/* 에러 메시지 */}
          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}

          {/* 회원가입 버튼 */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignup}
            sx={{ marginTop: 2 }}
            disabled={false}
          >
            회원가입
          </Button>

          {/* 로그인 페이지로 이동 */}
          <Button
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => router.push("/authentication/login")}
            sx={{ marginTop: 1 }} 
          >
            이미 계정이 있으신가요? 로그인
          </Button>
        </Box>
      </Box>
    </Grid>
  </Box>
</div>
);
}

export default CommonUserForm;