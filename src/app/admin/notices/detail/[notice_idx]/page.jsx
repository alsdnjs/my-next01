"use client";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react"; // TinyMCE Editor import
import { fetchNoticeDetail } from "../../fetchNoticeDetail/page";

export default function NoticeDetail({ params }) {
  const { notice_idx } = use(params); // URL에서 전달된 id 값
  const [data, setData] = useState(null); // 공지사항 데이터
  const [error, setError] = useState(null); // 에러 상태
  const [noticeContent, setNoticeContent] = useState(""); // 수정된 내용
  const router = useRouter();

  const handleDetailClick = () => {
    router.push(`/admin/notices/update/${notice_idx}`); // 수정 페이지로 이동
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await fetchNoticeDetail(notice_idx);
        if (!detail) {
          throw new Error("데이터를 찾을 수 없습니다.");
        }
        setData(detail);
        setNoticeContent(detail.notice_content); // 초기값 설정
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (notice_idx) {
      fetchData();
    }
  }, [notice_idx]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const handleEditorChange = (content) => {
    setNoticeContent(content); // TinyMCE 내용 업데이트
  };

  const handleSave = async () => {
    try {
      // 저장 로직
      const response = await fetch(`/api/notices/update/${notice_idx}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notice_content: noticeContent,
        }),
      });
      if (response.ok) {
        alert("수정되었습니다.");
        router.push("/admin/notices");
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div>
      <Box
        sx={{
          padding: "80px 40px",
          backgroundColor: "grey",
          color: "black",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            width: "600px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
              fontWeight: "bold",
              fontSize: "28px",
              color: "#333",
            }}
          >
            공지사항 상세 정보
          </Typography>
          <Link
            href="/admin/notices"
            passHref
            style={{ textDecoration: "none", color: "black" }}
          >
            <p>[목록으로 돌아가기]</p>
          </Link>
          <hr></hr>
          {data ? (
            <>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ width: "30%" }}>IDX</TableCell>
                      <TableCell>{data.notice_idx}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>작성한 관리자</TableCell>
                      <TableCell>{data.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>제목</TableCell>
                      <TableCell>{data.notice_subject}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ marginTop: 3, textAlign: "left" }}>
                <Editor
                  apiKey="7wi8djvoio93nw2l8ojf98dntqt7i9zkx2h6xyq6giyksnwt" // TinyMCE API Key
                  value={noticeContent}
                  init={{
                    height: 300,
                    menubar: false,
                    readonly: true, // 읽기 전용 상태로 설정
                    toolbar:
                      "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat",
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Link href="/admin/notices" passHref>
                  <Button variant="outlined" sx={{ mr: 2 }}>
                    취소
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  수정
                </Button>
              </Box>
            </>
          ) : (
            <p>데이터 없음</p>
          )}
        </Box>
      </Box>
    </div>
  );
}
