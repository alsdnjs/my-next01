"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '../../../../../store/authStore';


export default function DeleteAccount() {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const { token, logout } = useAuthStore();
    const router = useRouter();


    const deleteAccount = async () => {
        const API_URL = `${LOCAL_API_BASE_URL}/users/deleteAccount`
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // JSON 형식 명시
            }
        })
        if(response.data.success){
            alert("계정이 삭제되었습니다.");
            router.push('/');
            logout();
        }
    }

    useEffect(() => {
        if(confirm("정말 삭제하시겠습니까?")){
            deleteAccount();
        } else {
            router.push('/');
        }
    },[])

    return (
        <div>
            
        </div>
    );
}