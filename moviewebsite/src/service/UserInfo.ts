import { fetchApi } from "./apiConfig"

export interface UserInfointerface{
    
}
export const UserInfo() = async (data: UserInfointerface): Promise<boolean> => {
    try{
        const response = await fetchApi("/userinfo.do",{
            method : "POST",
            body :JSON.stringify(data);
        })
    }
    catch(e){

    }
}