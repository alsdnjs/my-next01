"use client";

import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function FAQPage() {
  const faqs = [
    { question: "캠핑장을 추가 하고 싶어요.", answer: "저희 캠플레이스는 사업자 등록 후 사업자 로그인으로 하신 후에 고객센터에 캠핑장 등록 및 수정에 글작성 해주시면 확인 후 등록 해드립니다.." },
    { question: "캠핑장에 Wi-Fi가 제공되나요 ?", answer: "일부 캠핑장에서 제공됩니다." },
    { question: "결제는 어떤 방법이 가능한가요 ?", answer: "간편하게 TOSS를 이용하여 가능합니다." },
    { question: "주변 정보를 확인 할 수 있나요 ?", answer: "저희 캠플레이스는 캠핑장 기준 5KM 이내 주변 약국을 알려주고 있습니다. " },
    { question: "반려동물 동반이 가능한가요 ?", answer: "일부 캠핑장은 반려동물 동반이 가능합니다. 캠핑장 별로 확인해 주세요." },
  ];

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: "center", color: "#333" }}>
        자주 묻는 질문
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />

      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          sx={{
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.15)" },
            "&::before": { display: "none" }, // 제거된 디폴트 스타일
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#597445" }} />}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "10px 10px 0 0",
              "& .MuiTypography-root": { fontWeight: "bold", color: "#333" },
            }}
          >
            <HelpOutlineIcon sx={{ marginRight: "10px", color: "#597445" }} />
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#fff", borderRadius: "0 0 10px 10px", padding: "15px" }}>
            <CheckCircleOutlineIcon sx={{ marginRight: "10px", color: "#28A745" }} />
            <Typography sx={{ color: "#555" }}>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
