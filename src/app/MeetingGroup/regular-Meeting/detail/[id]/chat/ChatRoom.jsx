'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Avatar, Paper, TextField, Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import ChatInput from './ChatInput';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [nickname, setNickname] = useState(''); // 닉네임 상태 추가
    const [nicknameSet, setNicknameSet] = useState(false); // 닉네임 입력 여부

    useEffect(() => {
        if (!nicknameSet) return; // 닉네임이 설정되지 않으면 WebSocket 연결하지 않음

        const socket = new SockJS('http://localhost:8080/ws/chat'); // WebSocket 서버 URL
        const client = Stomp.over(socket);

        client.connect({}, () => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/messages', (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, receivedMessage]);
            });
        });

        setStompClient(client);

        return () => {
            if (client) client.disconnect();
        };
    }, [nicknameSet]); // nicknameSet이 변경될 때만 WebSocket 연결

    const handleSetNickname = () => {
        if (nickname.trim()) {
            setNicknameSet(true);
        }
    };

    const sendMessage = (content) => {
        if (stompClient && content.trim()) {
            stompClient.send(
                '/app/message',
                {},
                JSON.stringify({
                    sender: nickname,
                    content,
                    timestamp: new Date().toLocaleTimeString(),
                })
            );
        }
    };

    // 닉네임 입력 화면
    if (!nicknameSet) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                    Enter your nickname to join the chat
                </Typography>
                <TextField
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    sx={{ marginBottom: '20px', width: '300px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSetNickname}
                    sx={{ backgroundColor: '#007BFF', color: '#fff' }}
                >
                    Join Chat
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                maxWidth: '730px',
                margin: '0 auto',
                border: '1px solid #F5F4F6',
                borderRadius: '14px',
                backgroundColor: '#fff',
            }}
        >
            {/* 헤더 */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 15px',
                    borderBottom: '1px solid #F5F4F6',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src="/images/user1.png" alt="user1" />
                    <Box sx={{ marginLeft: '10px' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Chat Room
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Active Now
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton>
                        <VideocamIcon />
                    </IconButton>
                    <IconButton>
                        <CallIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* 메시지 리스트 */}
            <Box sx={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: "#FAFAFA" }}>
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent:
                                msg.sender === nickname ? 'flex-end' : 'flex-start',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}
                    >
                        {msg.sender !== nickname && (
                            <Avatar
                                src="/images/user2.png"
                                alt="user2"
                                sx={{ width: 35, height: 35, marginRight: '10px' }}
                            />
                        )}
                        <Paper
                            sx={{
                                padding: '10px',
                                maxWidth: '60%',
                                borderRadius: '10px',
                                backgroundColor:
                                    msg.sender === nickname ? '#CFE9BA' : '#F5F5F5',
                                color: msg.sender === nickname ? '#000' : '#555',
                            }}
                        >
                            <Typography variant="body1">{msg.content}</Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    textAlign: 'right',
                                    marginTop: '5px',
                                    color: '#888',
                                }}
                            >
                                {msg.timestamp}
                            </Typography>
                        </Paper>
                        {msg.sender === nickname && (
                            <Avatar
                                src="/images/user1.png"
                                alt="user1"
                                sx={{ width: 35, height: 35, marginLeft: '10px' }}
                            />
                        )}
                    </Box>
                ))}
            </Box>

            {/* 메시지 입력 */}
            <ChatInput onSend={sendMessage} />
        </Box>
    );
};

export default ChatRoom;
