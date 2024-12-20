import { useState, useEffect } from "react";
import axios from "axios";

const useSignup = (LOCAL_API_BASE_URL) => {
  const [mId, setMId] = useState("");
  const [mPw, setMPw] = useState("");
  const [mPwConfirm, setMPwConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [zipcode, setZipcode] = useState("");               // 우편번호 
  const [address, setAddress] = useState("");               // 주소 
  const [addressDetail, setAddressDetail] = useState("");   // 상세주소
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [idStatus, setIdStatus] = useState({ message: "", isAvailable: true });
  const [passwordCheck, setPasswordCheck] = useState(false); //비밀번호 중복 확인

  // 입력 핸들러
  const handleIdChange = (e) => setMId(e.target.value);                         // 아이디
  const handlePwChange = (e) => setMPw(e.target.value);                         // 비밀번호
  const handleMPwConfirmChange = (e) => setMPwConfirm(e.target.value);          // 비밀번호 확인 
  const handleNameChange = (e) => setName(e.target.value);                      // 이름
  const handlePhoneChange = (e) => setPhone(e.target.value);                    // 핸드폰
  const handleEmailChange = (e) => setEmail(e.target.value);                    // 이메일
  const handleZipcodeChange = (e) => setZipcode(e.target.value);                // 우편번호호
  const handleAddressChange = (e) => setAddress(e.target.value);                // 주소 
  const handleAddressDetailChange = (e) => setAddressDetail(e.target.value);    // 상세주소
  const handleAgreeChange = (e) => setAgreed(e.target.checked);                 // 약관동의
  const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);  // 이메일 인증번호


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

  // 아이디 중복 확인
  useEffect(() => {
    if (mId && mId.length > 0) {
      const checkIdAvailability = async () => {
        try {
          const response = await axios.get(`${LOCAL_API_BASE_URL}/members/idCheck`, {
            params: { m_id: mId }
          });
  
          const data = response.data;
  
          setIdStatus({
            message: data.success ? "사용 가능한 아이디입니다." : "사용 중인 아이디입니다.",
            isAvailable: data.success,
          });

        } catch (error) {
          console.error("아이디 중복 체크 오류:", error);
        }
      };
  
      checkIdAvailability();
    } else {
      setIdStatus({ message: "", isAvailable: true }); // 아이디가 비어있으면 메시지 초기화
    }
  }, [mId, LOCAL_API_BASE_URL]);

  // 비밀번호 일치 확인
  useEffect(() => {
    if(mPwConfirm == mPw) {
      setPasswordCheck(true);
      console.log(passwordCheck);
    } else {
      setPasswordCheck(false);
      console.log(passwordCheck);
    }
  },[mPwConfirm, passwordCheck])




  return {
    mId, mPw, mPwConfirm, name, phone, email, emailVerified, verificationCode,
    zipcode, address, addressDetail, error, agreed, verificationSent, idStatus, passwordCheck, 
    handleIdChange, handlePwChange, handleMPwConfirmChange, handleNameChange, handlePhoneChange,
    handleEmailChange, handleZipcodeChange, handleAddressChange, handleAddressDetailChange,
    handleAgreeChange, handleVerificationCodeChange, handlePostCode,
    setError, setVerificationSent, setEmailVerified, setIdStatus, setPasswordCheck, setZipcode
  };
};

export default useSignup;
