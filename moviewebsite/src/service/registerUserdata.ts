import { fetchApi } from "@/service/apiConfig";

export interface RegisterRequest {
  id: string;
  email: string;
  password: string;
  phone: string;
}

export const registerUserdata = async (data: RegisterRequest): Promise<boolean> => {
  try {
    const response = await fetchApi<string>("/userregister.do", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    return true;
  } catch (error) {
    console.error("회원가입 실패:", error);
    return false;
  }
};