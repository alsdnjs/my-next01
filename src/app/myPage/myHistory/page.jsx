"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';

function ReservationHistory() {
  const token = useAuthStore((state) => state.token);  // zustand에서 token 값 가져오기
  const [data, setData] = useState([]);
  // 예시 데이터
  const reservationData = [
    {
      campground: '해수욕장 캠핑장',
      period: '2024-12-01 ~ 2024-12-05',
      price: '120,000원',
      status: '예약',
    },
    {
      campground: '산속 캠핑장',
      period: '2024-12-10 ~ 2024-12-12',
      price: '80,000원',
      status: '장박',
    },
    {
      campground: '숲속 캠핑장',
      period: '2024-12-15 ~ 2024-12-20',
      price: '150,000원',
      status: '이용완료',
    },
  ];
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const API_URL = `${LOCAL_API_BASE_URL}/myPage/getUsageHistory`;
    try {
      const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // JSON 형식 명시
        }
      })
      if(response.data.success){
        setData(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  // // 후기쓰기 버튼 클릭 핸들러
  // const handleReviewClick = (campground) => {
  //   alert(`${campground}에 대한 후기를 작성할 수 있습니다.`);
  // };

  return (
    <div>
    <Typography sx={{
      fontSize : "30px",
      ml:"15px",
      textAlign: "center",
      
    }}>
      예약/이용 내역
    </Typography>

      <TableContainer component={Paper}
        sx={{
          textAlign: "center"
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="예약/이용 내역 표">
          <TableHead>
            <TableRow>
              <TableCell>캠핑장 이름</TableCell>
              <TableCell  align="center">이용 기간</TableCell>
              <TableCell align="left">결제 금액</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">후기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.facltNm}
                </TableCell>
                <TableCell align="center">{row.checkin} ~ {row.checkout}</TableCell>
                <TableCell align="left">{row.payment_amount}</TableCell>
                <TableCell align="center">{row.action_type}</TableCell>
                <TableCell align="center">
                  {
                    row.action_type == "이용" ? <Button variant='contained'>후기작성</Button> : ""
                  }

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ReservationHistory;


                  {/* {row.status === '이용완료' && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleReviewClick(row.campground)}
                    >
                      후기쓰기
                    </Button>
                  )} */} 