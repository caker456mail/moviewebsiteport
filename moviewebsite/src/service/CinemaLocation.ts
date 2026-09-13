import { fetchApi } from "./apiConfig";

export interface CinemaLocation{
  cinemaName : string;
  cinemaLocation : string;
};
export const CinemaLocation = async (cinemaname:string) => {
  try {
    const response = await fetchApi("/cinemalocation.do",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body : JSON.stringify({
        cinemaName: cinemaname,
      })
    });
   
    console.log(response, "로케이션");
    return response;
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
