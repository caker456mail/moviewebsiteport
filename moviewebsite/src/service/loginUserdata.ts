import { fetchApi } from "./apiConfig";

export interface LoginRequest {
  email: string;     // backend의 email과 매핑
  password: string;  // 평문 비밀번호
}

// 백엔드 DB(users 테이블)에서 받아올 사용자 정보 타입 정의
export interface UserInfo {
  userId: string;
  email: string;
  username: string;   // 💡 DB 컬럼명인 username으로 매핑
  phoneNumber?: string;
  birthDate?: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  authProvider: string;
  createdAt: string;
}

export const loginUser = async (data: LoginRequest): Promise<boolean> => {
  try {
    // 💡 fetchApi<string> -> fetchApi<UserInfo> 로 수정
    const response = await fetchApi<UserInfo>("/userlogin.do", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    // 백엔드 응답(JSON 객체)이 성공적으로 오면 localStorage에 저장
    if (response) {
      localStorage.setItem("user", JSON.stringify(response));
      console.log(JSON.stringify(response));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login Error:", error);
    alert("서버 연결에 실패했습니다.");
    return false;
  }
};