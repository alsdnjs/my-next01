// pages/SuccessPage.js
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const orderId = queryParams.get('orderId');
  const amount = queryParams.get('amount');
  const paymentKey = queryParams.get('paymentKey');
  
  return (
    <div>
      <h1>결제 성공</h1>
      <p>주문 ID: {orderId}</p>
      <p>결제 금액: {amount}원</p>
      <p>결제 키: {paymentKey}</p>
      {/* 추가적인 결제 성공 후 처리 로직 */}
    </div>
  );
};

export default SuccessPage;
