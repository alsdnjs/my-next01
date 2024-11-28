"use client";

import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from "react";
import './guestBookDetails.css'



function Page({ params }) {
    const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    const [item, setItem] = useState(null); // 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // 로딩 시작
                const resolvedParams = await params; // Promise로 전달된 params 언래핑
                const { id } = resolvedParams; // id 추출
                const API_URL = `${LOCAL_API_BASE_URL}/guestbook/detail?gb_idx=${id}`;
                console.log(API_URL);
                // 데이터 가져오기
                const response = await axios.get(API_URL);
                setItem(response.data);
            } catch (err) {
                console.error("Error fetching product data:", err);
                setError("Failed to fetch product data.");
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchData();
    }, [params, LOCAL_API_BASE_URL]);

    // 로딩 중
    if (loading) {
        return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
    }

    // 에러 발생 시
    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
                <h2>Error:</h2>
                <p>{error}</p>
            </div>
        );
    }

    // 로딩 완료 후
    return (
        <>
            <h2 className="title">GuestBookDetails</h2>
            <TableContainer component={Paper} className="table-container">
                <Table className="custom-table">
                    <TableBody>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_idx}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_subject}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_content}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_pw}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell">{item.gb_regdate.substring(0, 10)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
export default Page;