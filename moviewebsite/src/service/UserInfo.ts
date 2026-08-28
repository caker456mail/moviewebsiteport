import { fetchApi } from "./apiConfig"

export interface UserInfointerface{
    userId:string,
    email:string,
    username:string,
    phoneNumber:string,
    birthDate:string,
    userRole:string,
    status:string,
    authProvider:string,
    createdAt:string
}
export const UserInfo() = async (data: UserInfointerface): Promise<boolean> => {
    try{
        const response = await fetchApi("/userinfo.do",{
            method : "POST",
            body :JSON.stringify(data)
        })
    }
    catch(e){

    }
}