// src/app/MeetingGroup/regular-Meeting/detail/[id]/bulletinboard/page.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  IconButton,
  TextField,
  Button,
  Modal,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  CircularProgress,
  Tooltip,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Divider, // MenuItem 임포트
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Link from "next/link";
import axios from "axios";

import styles from "./BulletinBoard.module.css";
import Detail from "./detail"; // 상세보기 모달

import useAuthStore from "store/authStore";
import { useRouter, useParams } from "next/navigation";
import { getCookie } from "cookies-next";

// API 및 이미지 URL을 위한 BASE_URL 정의
const LOCAL_API_BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8080/uploads";
const BASE_URL =
  process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL || "http://localhost:8080/api";

// ==================== 메인 컴포넌트 ====================
export default function BulletinBoardPage() {
  const params = useParams();
  const { id } = params || {};
  const meetingIdx = id;

  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const userIdx = user?.user_idx;

  // 로컬 상태
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 작성 모달
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // 검색 Drawer 내부 확장
  const [searchOpen, setSearchOpen] = useState(false); // 검색 항목 열기/닫기
  const [searchKeyword, setSearchKeyword] = useState("");

  // 드롭다운(수정/삭제) 메뉴
  const [anchorEls, setAnchorEls] = useState({});

  // 상세보기 모달
  const [selectedPost, setSelectedPost] = useState(null);

  // 인증 체크
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
          console.error("사용자 정보 가져오기 실패:", error);
          router.push("/authentication/login");
        }
      }
      // 토큰 없으면 로그인 페이지로
      if (!useAuthStore.getState().token) {
        router.push("/authentication/login");
      }
    };
    initializeAuth();
  }, [token, router]);

  // 게시물 목록 불러오기
  useEffect(() => {
    if (token && userIdx && meetingIdx) {
      fetchPosts();
    }
  }, [token, userIdx, meetingIdx]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = `${LOCAL_API_BASE_URL}/regular-meeting-board/meetings/${meetingIdx}/boards`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const boardData = response.data || [];

      const processedData = boardData.map((post) => {
        // 이미지 문자열 -> 배열
        if (post.image && post.image.image_url) {
          post.images = post.image.image_url.split(",").map((u) => u.trim());
        } else {
          post.images = [];
        }

        // 내가 좋아요 눌렀는지
        if (Array.isArray(post.likes)) {
          const userLike = post.likes.find(
            (like) => String(like.user_idx) === String(userIdx)
          );
          post.favorites_idx = userLike ? userLike.likes_idx : null;
        } else {
          post.favorites_idx = null;
        }
        return post;
      });

      setPosts(processedData);
      setFilteredPosts(processedData);
    } catch (error) {
      console.error("게시물 목록 불러오기 실패:", error);
      alert("게시물 목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  // 검색 로직
  useEffect(() => {
    let filtered = [...posts];
    if (searchKeyword.trim()) {
      const key = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.board_content && p.board_content.toLowerCase().includes(key)) ||
          (p.user &&
            p.user.username &&
            p.user.username.toLowerCase().includes(key))
      );
    }
    setFilteredPosts(filtered);
  }, [searchKeyword, posts]);

  // 게시물 삭제
  const handleDeletePost = async (boardIdx) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const url = `${LOCAL_API_BASE_URL}/regular-meeting-board/boards/${boardIdx}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("게시물이 삭제되었습니다.");
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제 실패");
    }
  };

  // 상세보기 열기
  const handleCardClick = (post) => {
    setSelectedPost(post);
  };
  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  // 본문 더보기
  const handleExpandToggle = (post) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.board_idx === post.board_idx ? { ...p, expanded: !p.expanded } : p
      )
    );
  };

  // 상세 페이지로 이동
  const handleDetailClick = (meetingIdx) => {
    router.push(`/admin/events/regular/detail/${meetingIdx}`); // 디테일 페이지로 이동
  };

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
          정규모임 게시판 정보
        </Typography>
        <div
          onClick={() => handleDetailClick(meetingIdx)} // handleDetailClick 호출
          style={{
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            cursor: "pointer", // 클릭 가능한 UI로 표시
          }}
        >
          <p>[목록으로 돌아가기]</p>
        </div>
        <Divider sx={{ backgroundColor: "#444", marginBottom: "20px" }} />
        {/* 로딩 또는 게시물 목록 */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          filteredPosts.map((post) => {
            let bracketTitle = "";
            let pureContent = post.board_content || "";
            if (pureContent.startsWith("[")) {
              const idx = pureContent.indexOf("]");
              if (idx > 1) {
                bracketTitle = pureContent.slice(1, idx);
                pureContent = pureContent.slice(idx + 1).trim();
              }
            }

            const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;

            return (
              <Card
                key={post.board_idx}
                sx={{
                  marginBottom: "20px",
                  borderRadius: "8px",
                  position: "relative",
                }}
                className={styles.postCard}
                onClick={() => handleCardClick(post)}
              >
                {/* 수정/삭제 아이콘 */}
                <Button
                  sx={{ position: "absolute", top: "5px", right: "5px" }}
                  onClick={() => handleDeletePost(post.board_idx)} // 삭제 함수 호출
                >
                  삭제
                </Button>

                {/* 작성자 */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                  }}
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

                {/* 이미지 슬라이더 */}
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  style={{ width: "100%", height: "400px" }}
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
                          alt={`img-${idx}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/images/default-post.jpg";
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src="/images/default-post.jpg"
                        alt="Default"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>

                {/* 좋아요/댓글 아이콘 + "좋아요 n개" */}
                <Box sx={{ padding: "0 10px", marginTop: "8px" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* 댓글 아이콘 */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(post);
                      }}
                    >
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                  </Box>

                  {/* 좋아요 개수 */}
                  <Typography
                    variant="body2"
                    sx={{ marginLeft: "10px", marginTop: "5px" }}
                  >
                    좋아요 {likeCount}개
                  </Typography>
                </Box>

                {/* 본문 내용 */}
                <Box sx={{ padding: "10px" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={bracketTitle}
                  >
                    {bracketTitle || "제목 없음"}
                  </Typography>

                  <Collapse in={post.expanded} timeout="auto" unmountOnExit>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginTop: "5px" }}
                    >
                      {pureContent || "내용 없음"}
                    </Typography>
                  </Collapse>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpandToggle(post);
                    }}
                    sx={{ textTransform: "none", marginTop: "5px" }}
                  >
                    {post.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}{" "}
                    더보기
                  </Button>
                </Box>
              </Card>
            );
          })
        )}

        {/* 상세보기 모달 */}
        {selectedPost && (
          <Detail
            postId={selectedPost.board_idx}
            onClose={handleCloseDetail}
            onAddComment={fetchPosts}
          />
        )}
      </Box>
    </div>
  );
}
// ==================== 메인 컴포넌트 끝 ====================
