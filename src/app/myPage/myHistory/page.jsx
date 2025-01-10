"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Stack, Pagination } from '@mui/material';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';
import useApi from '../../component/useApi';
import { useRouter } from 'next/navigation'; // next/router 대신 useRouter 사용

function MyUsageHistory() {
  const router = useRouter(); // router 객체 생성
  const token = useAuthStore((state) => state.token);  // zustand에서 token 값 가져오기
  const [data, setData] = useState([]);
  const { getData, postData } = useApi(token, setData);

  // 페이지
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 아이템 수

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // 페이지 상태 업데이트
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    getData("/myPage/getUsageHistory");
  }, []);

  // 디테일 페이지로 이동하는 함수
  const handleDetailClick = (contentId) => {
    router.push(`/campingdetail/${contentId}`); // 디테일 페이지로 이동
  };

  return (
    <div>
      <Typography sx={{
        fontSize: "30px",
        ml: "15px",
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
              <TableCell align="center">이용 기간</TableCell>
              <TableCell align="left">결제 금액</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">후기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData && currentData.length > 0 ? (
              currentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.facltNm}
                  </TableCell>
                  <TableCell align="center">{row.checkin} ~ {row.checkout}</TableCell>
                  <TableCell align="left">{row.payment_amount}</TableCell>
                  <TableCell align="center">{row.action_type}</TableCell>
                  <TableCell align="center">
                    {
                      row.action_type === "이용" ? (
                        <Button
                          variant='contained'
                          onClick={() => handleDetailClick(row.contentId)} // 클릭 시 디테일 페이지로 이동
                        >
                          후기작성
                        </Button>
                      ) : ""
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableCell colSpan={5} align='center'>예약 및 이용 내역이 없습니다.</TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination
            count={totalPages} // 전체 페이지 수
            page={currentPage} // 현재 페이지
            onChange={handlePageChange} // 페이지 변경 처리
            color="primary"
            showFirstButton
            showLastButton
            boundaryCount={2}
            siblingCount={4}
            hideNextButton={currentPage === totalPages}
            hidePrevButton={currentPage === 1} // 첫 페이지에서 '이전' 버튼 숨기기
          />
        </Stack>
      </div>
    </div>
  );
}

export default MyUsageHistory;
