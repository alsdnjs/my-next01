"use client";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useAuthStore from "store/authStore";
import axios from "axios";

function Page() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token); // Zustand에서 token 가져오기
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const [userIdx, setUserIdx] = useState("");
  const [adminIdx, setAdminIdx] = useState("");
  const [noticeSubject, setNoticeSubject] = useState("");
  const [noticeContent, setNoticeContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("notice_subject", noticeSubject);
      formData.append("notice_content", noticeContent);
      formData.append("admin_idx", adminIdx); // 관리자 ID

      const response = await axios.post(
        `http://localhost:8080/api/notice/notices/insert`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("공지사항 등록 성공!");
        router.push("/admin/notices");
      } else {
        alert("공지사항 등록 실패");
      }
    } catch (error) {
      console.error("등록 중 문제가 발생했습니다:", error);
      alert("등록 중 문제가 발생했습니다.");
    }
  };

  const handleNoticeSubjectChange = (e) => {
    setNoticeSubject(e.target.value);
  };

  const handleContentChange = (content) => {
    setNoticeContent(content);
  };

  // 유저 ID 가져오기
  const getUserIdx = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUserIdx(response.data.data.user_idx);
      } else {
        console.error("프로필 가져오기 실패:", response.data.message);
      }
    } catch (error) {
      console.error("프로필 요청 오류:", error);
    }
  };

  // 관리자 ID 가져오기
  const getAdminIdx = async () => {
    try {
      const response = await axios.get(
        `${LOCAL_API_BASE_URL}/admin/admins/check-type?user_idx=${userIdx}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setAdminIdx(response.data.admin_idx);
      } else {
        console.error("관리자 idx 가져오기 실패");
      }
    } catch (error) {
      console.error("관리자 idx 요청 오류:", error);
    }
  };

  useEffect(() => {
    if (userIdx) {
      getAdminIdx();
    }
  }, [userIdx]);

  useEffect(() => {
    if (token) {
      getUserIdx();
    }
  }, [token]);

  return (
    <Box
      sx={{
        backgroundColor: "grey",
        minHeight: "100vh",
        padding: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>공지사항 등록하기</h2>
        <Link
          href="/admin/notices"
          passHref
          style={{ textDecoration: "none", color: "black" }}
        >
          <p>[목록으로 돌아가기]</p>
        </Link>
        <hr />
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>
                  <TextField
                    name="notice_subject"
                    value={noticeSubject}
                    onChange={handleNoticeSubjectChange}
                    fullWidth
                    required
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>내용</TableCell>
                <TableCell>
                  <Editor
                    apiKey="7wi8djvoio93nw2l8ojf98dntqt7i9zkx2h6xyq6giyksnwt"
                    value={noticeContent}
                    onEditorChange={handleContentChange}
                    init={{
                      height: 300,
                      menubar: false,
                      toolbar:
                        "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat",
                      file_picker_callback: (callback, value, meta) => {
                        if (meta.filetype === "image") {
                          const input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*"); // 이미지 파일만 허용
                          input.onchange = async (e) => {
                            const file = e.target.files[0];

                            // 파일 업로드 로직
                            const formData = new FormData();
                            formData.append("file", file);

                            try {
                              const response = await axios.post(
                                `${LOCAL_API_BASE_URL}/api/files/upload`, // 업로드 API 엔드포인트
                                formData,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );

                              if (response.status === 200) {
                                const fileUrl = response.data.url; // 서버에서 반환된 파일 URL
                                callback(fileUrl, { alt: file.name });
                              } else {
                                alert("파일 업로드 실패");
                              }
                            } catch (error) {
                              console.error("파일 업로드 에러:", error);
                              alert("파일 업로드 중 문제가 발생했습니다.");
                            }
                          };
                          input.click();
                        }
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Link href="/admin/notices" passHref>
            <Button variant="outlined" sx={{ mr: 2 }}>
              취소
            </Button>
          </Link>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            등록하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Page;
