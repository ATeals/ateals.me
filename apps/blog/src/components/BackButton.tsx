import { IoReturnDownBack } from 'react-icons/io5';
import { IoHomeOutline } from 'react-icons/io5';

import { Button } from './ui/button';

export const BackButton = () => {
  const isPrevPageSameDomain = () => {
    const currentDomain = window.location.origin; // 현재 도메인
    const previousUrl = document.referrer; // 이전 페이지 URL

    return previousUrl && new URL(previousUrl).origin === currentDomain;
  };

  const handleClick = () => {
    if (isPrevPageSameDomain()) {
      // 같은 도메인일 경우 뒤로가기
      window.history.back();
    } else {
      // 다른 도메인일 경우 홈으로 이동
      window.location.href = '/';
    }
  };

  return (
    <Button variant={'ghost'} onClick={handleClick}>
      {isPrevPageSameDomain() ? (
        <>
          <IoReturnDownBack /> back
        </>
      ) : (
        <>
          <IoHomeOutline /> main
        </>
      )}
    </Button>
  );
};
