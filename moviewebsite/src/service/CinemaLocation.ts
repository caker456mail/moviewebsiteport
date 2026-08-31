import { fetchApi } from "./apiConfig";


export const CinemaLocation = async () => {
  try {
    const response = await fetchApi("/cinemalocation.do",{
      method:"POST"
    });
   
    console.log(response, "로케이션");
    return response;
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
