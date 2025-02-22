export const fetchMembers = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/member/members"); // Spring API 호출
    const data = await response.json();
    return data; // 데이터를 반환
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
