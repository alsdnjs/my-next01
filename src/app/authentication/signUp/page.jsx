"use client";
import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Checkbox, FormControlLabel, List, ListItem, ListItemText, Collapse, Grid, FormControl, RadioGroup, Radio } from "@mui/material";
import { useRouter } from "next/navigation";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "../Authentication.module.css";
import InputForm from "../../component/InputForm";
import useEmailVerification from "./hooks/useEmailVerification";
import useSignup from "./hooks/useSignUP";
import useBussinessNumberCheck from "./hooks/useBussinessNumberCheck";
import usePhoneVerification from "./hooks/usePhoneVerification";
import api from "../../../../services/axios";

function SignupPage() {
  const router = useRouter();

  const {
    phone,
    otp,
    phoneVerified,
    otpSended,
    handlePhoneChange,
    handleOtpChange,
    sendOtp,
    verifyOtp
  } = usePhoneVerification();

  // 이메일 커스텀 훅
  const {
    email,
    verificationCode,
    verificationSent,
    emailVerified,
    countdown,
    error,
    handleVerificationCodeChange,
    handleEmailChange,
    verifyCode,
    sendVerificationCode,
  } = useEmailVerification();

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

  const {
    mId, mPw, mPwConfirm, name, 
    zipcode, address, addressDetail, agreed, idStatus, passwordCheck,
    handleIdChange, handlePwChange, handleMPwConfirmChange, handleNameChange,
    handleAgreeChange, handleZipcodeChange, handleAddressChange, handleAddressDetailChange,  //주소
    setError, handlePostCode
  } = useSignup(LOCAL_API_BASE_URL);
  
  // 사업자 등록번호 조회 훅
  const {
    businessNumber, 
    startedDate,
    ceoName,
    handleValidate,
    handleBusinessNumberChange,
    handleCeoNameChange,
    handleStartedDateChange,
    validated
  } = useBussinessNumberCheck();

  

  const [selectedForm, setSelectedForm] = useState("form1");         // 일반, 사업자 폼 구분
  const [openTerms, setOpenTerms] = useState({ term1: false, term2: false });  // 약관 열기

  

  // 약관 열기/닫기 핸들러
  const toggleTerm = (term) => {
    setOpenTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  useEffect(() => {
    // 카카오 주소 검색 스크립트 추가
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (!mId || !mPw || !mPwConfirm || !name || !phone || !email || !zipcode || !address || !addressDetail) {
      alert("모든 필드를 입력하세요.");
      return;
    }
    if(!idStatus){
      alert("이미 사용중인 아이디입니다.");
    }
    if (mPw !== mPwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    if (!alert) {
      setError("약관에 동의해야 회원가입이 가능합니다.");
      return;
    }

    
      const memberData = {
        m_id: mId,
        m_name: name,
        m_pw: mPw,
        email: email,
        phone: phone,
        zipcode: zipcode,
        address: address,
        address_detail: addressDetail,
        business_number: businessNumber,
        business_ceo: ceoName,
        started_date: startedDate
    };


    try {
      const response = await api.post('/api/members/join', memberData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      if(response.data.success){
        console.log(response.data);
        router.push('/');
      }
    } catch (error) {
      alert('회원가입 실패' + error);
    }   
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
          <form onSubmit={handleSubmit}>
          <Box>
              {/* 선택된 폼 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button
                  variant={selectedForm === 'form1' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedForm('form1');
                    setBussinessNumber("");
                  }}
                  
                  sx={{ margin: '0 10px' }}
                >
                  일반 가입자
                </Button>
                <Button
                  variant={selectedForm === 'form2' ? 'contained' : 'outlined'}
                  onClick={() => {setSelectedForm('form2')}}
                  sx={{ margin: '0 10px' }}
                >
                  사업자 가입자 
                </Button>
              </Box>
              <Box>
                {selectedForm === 'form1' && (
                  <p/>
                )}
                {selectedForm === 'form2' && (
                  <Box component="form">
                    <h2>사업자등록번호 조회</h2>
                    <Box
                      sx={{background: "#fff", padding: "30px 20px", borderRadius: "10px", mb: "20px",}}
                      className="bg-black"
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <InputForm
                          label="사업자명"
                          name="ceoName"
                          value={ceoName}
                          onChange={handleCeoNameChange}
                          disabled={validated}
                        />
                        <InputForm
                          label="사업자등록번호"
                          maxLength='10'
                          name="BusinessNumber"
                          placeholder="-없이 입력해주세요."
                          value={businessNumber}
                          onChange={handleBusinessNumberChange}
                          disabled={validated}
                        />
                        <InputForm
                          label="개업일자"
                          name="startedDate"
                          maxLength='8'
                          placeholder="YYYYMMDD"
                          value={startedDate}
                          onChange={handleStartedDateChange}
                          disabled={validated}
                        />
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
                            ml:"20px",
                            mr:"2px",
                            padding: "10px 10px",
                            color: "#fff !important",
                          }}
                          onClick={handleValidate}
                          disabled={false}
                        >
                          인증하기
                        </Button>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 3, ml: 3 }}>
                          {validated ? '인증 완료되었습니다.' : ''}
                        </Typography>
                      
                      </Grid>
                    
                    </Box>      
                  </Box>
                )}
              </Box>
            {/* 페이지 제목 */}
            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
              <img
                src="/images/favicon.png" //메인 이미지
                alt="favicon"
                className={styles.favicon}
              />
            </Typography>

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
                    disabled={phoneVerified}
                  />
                  <Button
                    xs={4}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={sendOtp}
                    disabled={phoneVerified}
                  >
                    휴대폰 인증하기
                  </Button> 
                  <InputForm
                    label="인증번호"
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    //otp 발송 전과 인증 후에 disabled
                    disabled={!otpSended || phoneVerified}
                    xs={12}
                  />
                  <Button
                    xs={4}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    disabled={!otpSended || phoneVerified}
                    onClick={verifyOtp}
                  >
                    확인
                  </Button> 
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
                <ListItem onClick={() => toggleTerm("term1")}>
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
                <ListItem onClick={() => toggleTerm("term2")}>
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
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              // onClick={handleSignup}
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
        </form>
      </Grid>
    </Box>
  </div>
  );
}

export default SignupPage;