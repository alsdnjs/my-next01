"use client"
import InputForm from "../../component/InputForm"
import { Box, Button, Typography } from "@mui/material"
import Link from "next/link"
import useSignup from "../signUp/hooks/useSignUP"
import axios from "axios"
import { useRouter } from "next/navigation"
import useAuthStore from "../../../../store/authStore"


export default function snsLoginSetPassword(params) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL
    const router = useRouter();  // useRouter 초기화
    const {token} = useAuthStore();

    const {
        handlePasswordChange,
        handlePasswordConfirmChange,
        password,
        passwordConfirm,
        passwordCheck
    } = useSignup();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // e.preventDefault(); // 기본 Enter 동작 막기 (필요시)
            goServer();
            console.log("keydown");
        }
    };

    const snsLoginSetPassword = async () => {
        const API_URL = `${LOCAL_API_BASE_URL}/users/snsLoginSetPassword`
        try {
            const response = await axios.post(API_URL, password, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // JSON 형식 명시
                }
            })

            console.log(response);
            
            if(response.data.success){
                alert("비밀번호가 설정되었습니다.");
                router.push('/');
            } else {
                alert("error");
            }
        } catch (error) {
            alert("error : " + error);
        }
    }
    return(
        <Box sx={{
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center'
        }}>
            <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px" mt="30px">
                비밀번호 설정
            </Typography>
        
            <Typography fontSize="15px" mb="30px">
                Enter your email and we′ll send you instructions to reset your
                password
            </Typography>
        
            <Box xs={6} xl={6}
                sx={{
                    maxWidth: '500px',
                    minWidth: '500px',
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                }}
                className="bg-black"
            >
                <InputForm
                    label="비밀번호"
                    type="password" // 보이는 상태에 따라 입력 타입 변경
                    name="password"
                    autoFocus = "true"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                />

                <InputForm
                    label="비밀번호 확인"
                    type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                />

                {/* 비밀번호 일치 확인 */}
                {/* InputForm(label, type, name, value, onChange) */}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, ml: 3 }}>
                    {passwordConfirm == "" ?  "" : (passwordCheck ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.")}
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 1,
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        fontWeight: "500",
                        fontSize: "16px",
                        padding: "12px 10px",
                        color: "#fff !important"
                    }}
                    onClick={snsLoginSetPassword}
                    disabled={!passwordCheck}
                >
                    Confirm
                </Button>

                <Box as="div" textAlign="center" mt="20px">
                    <Link
                        href="/myPage/myUserInfo"
                        className="primaryColor text-decoration-none"
                    >
                        <i className="ri-arrow-left-s-line"></i> Back to Sign in
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}