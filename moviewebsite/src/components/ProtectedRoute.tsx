import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPath: string; // 페이지 내부에서 직접 넣어준 경로 (/login55155 등)
}

export default function ProtectedRoute({ children, requiredPath }: ProtectedRouteProps) {
  const location = useLocation();

  // 현재 브라우저 URL 주소가 페이지에서 설정한 requiredPath와 일치하는지 스스로 검사
  if (location.pathname !== requiredPath) {
    return null; // 주소가 안 맞으면 화면을 그리지 않음
  }

  // 주소가 일치하면 해당 page.tsx의 내용을 화면에 띄움
  return <>{children}</>;
}