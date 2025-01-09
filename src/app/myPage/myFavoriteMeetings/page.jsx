"use client"
import { Avatar, AvatarGroup, Box, Chip, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';
import useApi from '../../component/useApi';

export default function MyFavoriteMeetings() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const BASE_URL = "http://localhost:8080";
    const {token} = useAuthStore();  // zustand에서 token 값 가져오기
    const [data, setData] = useState([
        {name:"meeting"},
        {name:"function"}
    ]);
    const {getData, postData} = useApi(token, setData);


    useEffect(() => {
        if (token) {
            getData(
                "/myPage/getMyLikesMeetings",           // url
                {},                         // 매개변수
                ()=>{} ,                    // 성공 시 메서드
                () => {                     // 실패 시 메서드
                    alert("로그인해주세요.");
                    logout();
                    router.push('/');
            })
        }
    }, [token]);

    const toggleLikesDelete = async(meeting_idx) => {
        const API_URL = `${LOCAL_API_BASE_URL}/myPage/toggleLikes`
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`  // JWT 토큰을 Authorization header에 담아서 전송
            },
            params: {
                meeting_idx: meeting_idx, // params는 객체로 전달
            },
        })

        if(response.data.success){
            alert("좋아요에서 삭제되었습니다.");
            setData(data.filter((data) => data.meeting_idx !== meeting_idx)); // 상태 업데이트
        }
    }

    return (
        <div>
        <Typography variant="h5">내가 찜한 모임</Typography>
      {/* 모임 카드 */}
        <Grid container spacing={3} justifyContent="center">
            {data.map((data, index) => (
                <Grid item key={data.meeting_idx}>
                    <Paper
                        elevation={3}
                        onClick={() => handleCardClick(data.meeting_idx)}
                        sx={{
                            cursor: 'pointer',
                            width: '360px',
                            height: '150px',
                            display: 'flex',
                            alignItems: 'center',
                            mt:"50px",
                            padding: '16px',
                            backgroundColor: data.favorites_idx ? '#ffe5b4' : '#f5eedc',
                            color: data.favorites_idx ? '#704C2E' : '#595959',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            borderRadius: '12px',
                            transition: 'background-color 0.3s, transform 0.3s',
                            '&:hover': {
                                backgroundColor: data.favorites_idx ? '#ffd18c' : '#e4d7c5',
                                transform: 'scale(1.02)',
                            },
                        }}
                    >
                {/* 하트 아이콘 */}
                <Box
                    onClick={(e) => {
                        toggleLikesDelete(data.meeting_idx);
                    }}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        cursor: 'pointer',
                        zIndex: 10,
                        animation: data.favorites_idx ? 'likeAnimation 0.3s ease-in-out' : 'none',
                    }}
                >
                    {data.favorites_idx ? <FavoriteBorderIcon sx={{ backgroundColor: 'red' }} /> :<FavoriteIcon/>  }
                </Box>

                {/* 모임 이미지 */}
                <Box
                    component="img"
                    src={`${BASE_URL}/images/${data.profile_image}`}  // {meeting.profile_image}
                    alt="모임 대표 이미지"
                    sx={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        marginRight: '16px',
                        flexShrink: 0,
                    }}
                    // onError={(e) => { e.target.src = '/images/camping2.png'; }} // 기본 이미지 설정
                />
                {/* 모임 설명 */}
                <Box
                    sx={{
                    width: 'calc(100% - 146px)',
                    overflow: 'hidden',
                    }}
                >
                    <Typography variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    >
                    {data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {data.region} · {data.subregion}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {data.created_at}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ marginRight: '8px' }}>
                        정원: {Array.isArray(data.membersAvatar) ? data.membersAvatar.length : 0} /{data.personnel}
                    </Typography>
                    <AvatarGroup max={4}>
                        {/* {Array.isArray(meeting.membersAvatar) &&
                        meeting.membersAvatar
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 4)
                            .map((mem) => (
                            <Avatar key={mem.user_idx || mem.avatar_url} src={`${IMAGE_BASE_URL}/${mem.avatar_url}`} />
                            ))} */}

                    </AvatarGroup>
                    </Box>
                    <Box sx={{ marginTop: '8px', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Array.isArray(data.hashtags) && data.hashtags.map((tagObj) => (
                        <Chip
                        key={tagObj.hashtag_idx || tagObj.name} // 고유한 키 사용
                        label={tagObj.name}
                        sx={{ backgroundColor: '#b3d468', fontSize: '12px' }}
                        />
                    ))}
                    </Box>
                </Box>
                </Paper>
            </Grid>
            ))}
        </Grid>

    </div>
    )
}