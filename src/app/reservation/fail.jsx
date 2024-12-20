import { useRouter } from 'next/router';

const FailPage = () => {
  const router = useRouter();
  const { errorCode } = router.query;  // URL에서 errorCode를 가져옴

  return (
    <div>
      <h1>결제 실패</h1>
      <p>결제에 실패하였습니다. 오류 코드: {errorCode}</p>
      <p>다시 시도해주세요.</p>
    </div>
  );
};

export default FailPage;
