// src/app/MeetingGroup/regular-Meeting/detail/[id]/bulletinboard/detail.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  Snackbar,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import useAuthStore from "store/authStore";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

const Comment = ({
  comment,
  depth = 0, // depth prop 추가
  onDelete, // 삭제 핸들러
}) => {
  const renderReplies = () => {
    if (!comment.children || comment.children.length === 0) return null;

    return comment.children.map((reply) => (
      <motion.div
        key={reply.comment_idx}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Comment comment={reply} depth={depth + 1} onDelete={onDelete} />
      </motion.div>
    ));
  };

  return (
    <Box sx={{ marginLeft: depth * 4, marginTop: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={comment.user?.avatar_url || "/images/default-avatar.jpg"}
          alt={comment.user?.username || "익명"}
          sx={{ width: 30, height: 30, marginRight: 1 }}
        />
        <Typography variant="body2" fontWeight="bold">
          {comment.user?.username || "익명"}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ marginLeft: 1 }}
        >
          {new Date(comment.uploaded_at).toLocaleString()}
        </Typography>
        {/* 삭제 버튼 */}
        <IconButton
          size="small"
          onClick={() => onDelete(comment)} // 삭제 핸들러 호출
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ marginLeft: 4, marginTop: 0.5 }}>
        {comment.comment_content}
      </Typography>
      <Box sx={{ marginTop: 1 }}>{renderReplies()}</Box>
    </Box>
  );
};

export default function Detail({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const userIdx = user?.user_idx;

  const BASE_URL =
    process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api";

  useEffect(() => {
    const initializeAuth = async () => {
      const cookieToken = getCookie("token");
      if (cookieToken && !token) {
        useAuthStore.getState().setToken(cookieToken);
        try {
          const response = await axios.get(`${BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${cookieToken}` },
          });
          if (response.data.success) {
            useAuthStore.getState().setUser(response.data.data);
          } else {
            router.push("/authentication/login");
          }
        } catch (error) {
          router.push("/authentication/login");
        }
      }
      if (!useAuthStore.getState().token) {
        router.push("/authentication/login");
      }
    };
    initializeAuth();
  }, [token, router, postId]);

  useEffect(() => {
    if (postId && token && userIdx) {
      fetchPost();
    }
  }, [postId, token, userIdx]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/regular-meeting-board/boards/${postId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedPost = response.data;

      if (fetchedPost.image && fetchedPost.image.image_url) {
        fetchedPost.images = fetchedPost.image.image_url
          .split(",")
          .map((url) => url.trim());
      } else {
        fetchedPost.images = [];
      }

      if (Array.isArray(fetchedPost.comments)) {
        const commentMap = {};
        fetchedPost.comments.forEach((cmt) => {
          cmt.children = [];
          commentMap[cmt.comment_idx] = cmt;
        });
        const topLevelComments = [];
        fetchedPost.comments.forEach((cmt) => {
          if (cmt.parent_id) {
            if (commentMap[cmt.parent_id]) {
              commentMap[cmt.parent_id].children.push(cmt);
            }
          } else {
            topLevelComments.push(cmt);
          }
        });
        fetchedPost.comments = topLevelComments;
      }

      setPost(fetchedPost);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("게시물이 존재하지 않습니다.");
        onClose();
      } else {
        alert("게시물 상세 조회 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  const likeCount = post
    ? Array.isArray(post.likes)
      ? post.likes.length
      : 0
    : 0;
  const commentCount = post
    ? Array.isArray(post.comments)
      ? post.comments.reduce(
          (acc, cmt) => acc + 1 + (cmt.children ? cmt.children.length : 0),
          0
        )
      : 0
    : 0;

  let bracketTitle = "";
  let pureContent = post?.board_content || "";
  if (pureContent.startsWith("[")) {
    const idx = pureContent.indexOf("]");
    if (idx > 1) {
      bracketTitle = pureContent.slice(1, idx);
      pureContent = pureContent.slice(idx + 1).trim();
    }
  }

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!post) return null;

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (comment) => {
    if (!confirm("정말 댓글을 삭제하시겠습니까?")) return;
    try {
      const url = `${BASE_URL}/regular-meeting-board/comments/${comment.comment_idx}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage("댓글이 삭제되었습니다.");
      setSnackbarOpen(true);
      fetchPost(); // 상세 재조회
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      setSnackbarMessage(
        `댓글 삭제 실패: ${error.response?.data?.error || "알 수 없는 오류"}`
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <Modal open={!!postId} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          bgcolor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "80%" },
          height: { xs: "90%", md: "80%" },
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: 24,
        }}
      >
        {/* 닫기 버튼 */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}
          aria-label="닫기"
        >
          <CloseIcon />
        </IconButton>

        {/* 왼쪽: 이미지 */}
        <Box
          sx={{
            flex: 3,
            position: "relative",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <Swiper
            modules={[Navigation, SwiperPagination]}
            navigation
            pagination={{ clickable: true }}
            style={{ width: "100%", height: "100%" }}
            onInit={(swiper) => {
              swiper.navigation.prevEl.addEventListener("click", (e) =>
                e.stopPropagation()
              );
              swiper.navigation.nextEl.addEventListener("click", (e) =>
                e.stopPropagation()
              );
            }}
          >
            {Array.isArray(post.images) && post.images.length > 0 ? (
              post.images.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`http://localhost:8080${imgUrl}`}
                    alt={`postImage-${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.src = "/images/default-post.jpg")}
                    onClick={(e) => e.stopPropagation()}
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img
                  src="/images/default-post.jpg"
                  alt="Default"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onClick={(e) => e.stopPropagation()}
                />
              </SwiperSlide>
            )}
          </Swiper>
        </Box>

        {/* 오른쪽: 내용 */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
          >
            <Avatar
              src={post.user?.avatar_url || "/images/default-avatar.jpg"}
              alt={post.user?.username || ""}
              sx={{ marginRight: "10px" }}
            />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {post.user?.username || "익명"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(post.uploaded_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2">좋아요 {likeCount}개</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ChatBubbleOutlineIcon sx={{ marginRight: "5px" }} />
              <Typography variant="body2">댓글 {commentCount}개</Typography>
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginTop: "10px" }}
          >
            {bracketTitle || "제목 없음"}
          </Typography>
          <Divider sx={{ marginY: "5px" }} />
          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", whiteSpace: "pre-wrap" }}
          >
            {pureContent || "내용 없음"}
          </Typography>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: "10px" }}
            >
              댓글
            </Typography>
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              <AnimatePresence>
                {post.comments.map((cmt) => (
                  <motion.div
                    key={cmt.comment_idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Comment
                      comment={cmt}
                      depth={0}
                      onDelete={handleDeleteComment}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <Typography variant="body2" color="textSecondary">
                댓글이 없습니다.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
