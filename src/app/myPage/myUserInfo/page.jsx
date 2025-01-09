"use client"
import { Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
import Cookies from 'js-cookie'; // 쿠키 관리 라이브러리 사용
import useApi from '../../component/useApi';

function MyUserInfo(props) {
  const [userProfile, setUserProfile] = useState({});
  const router = useRouter();
  const {isAuthenticated, logout, initialize} = useAuthStore();
  const {token} = useAuthStore();  // zustand에서 token 값 가져오기
  const {getData, postData} = useApi(token, setUserProfile);

  const [open, setOpen] = useState(false); // 모달 열림 상태
  const [image, setImage] = useState(null); // 이미지 파일 상태
  const [preview, setPreview] = useState(null); // 이미지 미리보기 상태
  let file_path = "http://localhost:8080/images/" +  userProfile.avatar_url;
  
  // 모달 열기
  const handleClickOpen = () => {
    setOpen(true);
  };

  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setPreview(null);
  };
    
  useEffect(() => {
    const token = Cookies.get('token');
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

    //zustand에 토큰과 사용자 정보가 있으면 초기화, 아니면 경고창
    if (token && user) {
      initialize({ user, token });
    } else {
      alert("로그인이 필요합니다.");
    }
  }, [initialize]);
  // 토큰 가져오기

  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  

  // const getProfile = async () => {

  //   try {
  //     const API_URL = `${LOCAL_API_BASE_URL}/users/profile`;
  //     const response = await axios.get(API_URL, {
  //       headers: {
  //         Authorization: `Bearer ${token}`  // JWT 토큰을 Authorization header에 담아서 전송
  //       }
  //     });
  //     console.log(response);
      
  //     if(response.data.success){
  //       setUserProfile(response.data.data);
  //     }

  //   } catch (error) {
  //     console.error(error);
  //     alert("로그인해주세요.");
  //     setIsAuthenticated(false);
  //     router.push('/');
  //   }
  // }

  // 이미지 선택 후 미리보기
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // 미리보기 URL 생성
      console.log(URL.createObjectURL(file));
    }
  };

  // 프로필 사진 변경 요청청
  const updateProfileImage = async() => {
    const API_URL = `${LOCAL_API_BASE_URL}/myPage/updateProfileImage`;
    const formData = new FormData();

    formData.append('image', image); // 파일을 FormData에 추가
    formData.append('prevImage', userProfile.avatar_url)
    

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더 설정
        },
      })

      if(response.data.success){
        console.log('프로필이 성공적으로 업데이트 되었습니다:', response.data),
        alert('프로필이 성공적으로 업데이트 되었습니다:', response.data);
        setImage(null);
        setPreview("");
        getData(
          "/users/profile",           // url
          {},                         // 매개변수
          ()=>{} ,                    // 성공 시 메서드
          () => {                     // 실패 시 메서드
            alert("로그인해주세요.");
            logout();
            router.push('/');
        })
        console.log(userProfile);
        
      }
      

    } catch (error) {
      console.error('문의 제출 중 오류 발생:', error);
    }
  }

  useEffect(() => {
    if (token) {
      getData(
        "/users/profile",           // url
        {},                         // 매개변수
        ()=>{} ,                    // 성공 시 메서드
        () => {                     // 실패 시 메서드
          alert("로그인해주세요.");
          logout();
          router.push('/');
      })
    }
    console.log(file_path);
  }, [token]);

  const handleModifyClick = () => {
    router.push("/myPage/myUserInfo/passwordCheck?action=update");  // 수정 페이지로 이동
  };
  const handleDeleteClick = () => {
    router.push("/myPage/myUserInfo/passwordCheck?action=delete");
  }

  const displayEmail = userProfile.email || userProfile.sns_email_kakao || userProfile.sns_email_naver || userProfile.sns_email_google;


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
          src={"http://localhost:8080/images/" +  userProfile.avatar_url}
          sx={{ width: 100, height: 100, margin: '0 auto' }}
          onClick={handleClickOpen}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        {/* 이름 */}
        <Typography variant="h5" gutterBottom>
          {userProfile.username}
        </Typography>
        {/* 닉네임 */}
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {userProfile.id}
        </Typography>
        {/* 아이디 */}
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {displayEmail ? displayEmail : "이메일 정보 없음"}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        {/* 회원정보 수정 버튼 */}
        <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: 2 }} onClick={handleModifyClick}>
          회원정보 수정
        </Button>
        {/* 회원 탈퇴하기 버튼 */}
        <Button variant="outlined" color="error" fullWidth onClick={handleDeleteClick}>
          회원 탈퇴하기
        </Button>
      </Box>




      {/* 모달 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>프로필 사진 변경</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {/* 처음엔 원래 프로필 사진 나오고 다른 파일 선택시 변경됨됨 */}
          {preview ? (
            <div style={{ marginTop: 10, alignItems:"center" }}>
              <Avatar src={preview} alt="Preview" style={{ width: 150, height: 150, objectFit: "cover" }}/>
            </div>
          ) : (
            <div style={{ marginTop: 10, alignItems:"center" }}>
              <Avatar src={"http://localhost:8080/images/" +  userProfile.avatar_url} alt="Preview" style={{ width: 150, height: 150, objectFit: "cover" }}/>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={updateProfileImage} color="primary">
            변경
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyUserInfo;