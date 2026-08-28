import { fetchApi } from "./apiConfig";


export const Cinema = async () => {
  try {
    const response = await fetchApi("/cinemainfo.do",{
      method:"GET"
    });
   
    console.log(response, "광녀두두둗두");
    return response;
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
