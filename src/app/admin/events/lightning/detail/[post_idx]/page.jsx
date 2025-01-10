"use client";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function CampingDetail({ params }) {
  const { post_idx } = use(params); // URL에서 전달된 post_idx 값
  const [data, setData] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [error, setError] = useState(null); // 에러 상태
  const router = useRouter();

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/meeting/comment/${post_idx}`
      );
      const nestedComments = buildCommentTree(response.data);
      setComments(nestedComments);
    } catch (error) {
      console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
      setComments([]);
    }
  };

  const buildCommentTree = (comments) => {
    const commentMap = new Map();
    comments.forEach((comment) =>
      commentMap.set(comment.comment_idx, { ...comment, replies: [] })
    );
    const rootComments = [];

    comments.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.comment_idx));
        }
      } else {
        rootComments.push(commentMap.get(comment.comment_idx));
      }
    });

    return rootComments;
  };

  const renderComments = (comments, level = 0) => {
    return comments.map((comment) => (
      <React.Fragment key={comment.comment_idx}>
        <TableRow>
          <TableCell sx={{ paddingLeft: `${level * 20}px` }} width={"15%"}>
            {comment.writer_idx}
          </TableCell>
          <TableCell>{comment.content}</TableCell>
          <TableCell width={"20%"}>{comment.created_at}</TableCell>
          <TableCell width={"10%"}>
            <Button
              type="submit"
              style={{
                height: "30px",
                borderColor: "#555",
                color: "white",
                backgroundColor: "#333",
              }}
              onClick={() => handleDelete(comment.comment_idx)}
            >
              삭제
            </Button>
          </TableCell>
        </TableRow>
        {comment.replies.length > 0 &&
          renderComments(comment.replies, level + 1)}
      </React.Fragment>
    ));
  };

  const handleDetailClick = (post_idx) => {
    router.push(`/admin/events/lightning/update/${post_idx}`); // 수정 페이지로 이동
  };

  const handleDelete = async (comment_idx) => {
    const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return; // 사용자가 취소 버튼을 누른 경우
    }
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/meeting/comment/delete/${comment_idx}`
      );
      if (response.status === 200) {
        alert("댓글이 성공적으로 삭제되었습니다.");
        fetchComments(); // 댓글 목록 갱신
      } else {
        alert(`댓글 삭제에 실패했습니다: ${response.data}`);
      }
    } catch (error) {
      console.error("댓글 삭제 요청 중 오류 발생:", error);
      alert(`오류 발생: ${error.response?.data || error.message}`);
    }
  };

  const handleDeleteMeeting = async (comment_idx) => {
    const confirmDelete = window.confirm("정말로 이 모임을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return; // 사용자가 취소 버튼을 누른 경우
    }
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/meeting/meetings/delete/${comment_idx}`
      );
      if (response.status === 200) {
        alert("모임이 성공적으로 삭제되었습니다.");
        router.push("/admin/events/lightning/view");
        fetchComments(); // 댓글 목록 갱신
      } else {
        alert(`모임 삭제에 실패했습니다: ${response.data}`);
      }
    } catch (error) {
      console.error("모임 삭제 요청 중 오류 발생:", error);
      alert(`오류 발생: ${error.response?.data || error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/meeting/meetings/${post_idx}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 가져오는 데 실패했습니다.");
      }
    };

    if (post_idx) {
      fetchData();
      fetchComments(); // 댓글 데이터 가져오기
    }
  }, [post_idx]); // post_idx가 변경되면 데이터 다시 가져오기

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "grey",
        minHeight: "100vh",
        padding: "40px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component={Paper}
        sx={{
          width: "80%",
          maxWidth: "900px",
          padding: "20px 30px",
          borderRadius: "10px",
          backgroundColor: "white",
          color: "black",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          번개모임 정보
        </Typography>

        <Divider sx={{ backgroundColor: "#444", marginBottom: "20px" }} />

        {data ? (
          <>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: "black", width: "20%" }}>
                      IDX
                    </TableCell>
                    <TableCell>{data.post_idx}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "black" }}>제목</TableCell>
                    <TableCell>{data.title || "정보없음"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "black" }}>내용</TableCell>
                    <TableCell
                      sx={{
                        height: "200px",
                        maxHeight: "400px", // 최대 높이 설정
                        overflowY: "auto", // 스크롤 가능
                        padding: "10px", // 내용 여백
                        backgroundColor: "#f9f9f9", // 배경색 추가
                        borderRadius: "5px", // 모서리 둥글게
                        whiteSpace: "pre-wrap", // 줄바꿈 유지
                      }}
                    >
                      {data.content || "정보없음"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "black" }}>모임장소</TableCell>
                    <TableCell>{data.meeting_location || "정보없음"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "black" }}>모임일자</TableCell>
                    <TableCell>{data.meeting_date || "정보없음"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={4}>
              <Typography sx={{ marginBottom: "10px", fontWeight: "bold" }}>
                댓글 목록
              </Typography>
              {comments.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#aaa" }}>작성자 ID</TableCell>
                        <TableCell sx={{ color: "#aaa" }}>내용</TableCell>
                        <TableCell sx={{ color: "#aaa" }}>작성일자</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{renderComments(comments)}</TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{ color: "#aaa" }}>댓글이 없습니다.</Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Link href="/admin/events/lightning/view" passHref>
                <Button
                  variant="outlined"
                  sx={{
                    color: "black",
                    borderColor: "#555",
                    "&:hover": { borderColor: "white" },
                  }}
                >
                  목록으로
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#5A9F33",
                  color: "white",
                  "&:hover": { backgroundColor: "#3E7A26" },
                }}
                onClick={() => handleDetailClick(data.post_idx)}
              >
                수정
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#D32F2F",
                  color: "white",
                  "&:hover": { backgroundColor: "#9A0007" },
                }}
                onClick={() => handleDeleteMeeting(data.post_idx)} // post_idx 전달
              >
                삭제
              </Button>
            </Box>
          </>
        ) : (
          <Typography>데이터 없음</Typography>
        )}
      </Box>
    </div>
  );
}
