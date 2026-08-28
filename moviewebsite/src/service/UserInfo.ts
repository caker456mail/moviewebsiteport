import { fetchApi } from "./apiConfig"

export interface UserInfointerface {
    userId: string,
    email: string,
    username: string,
    phoneNumber: string,
    birthDate: string,
    userRole: string,
    status: string,
    authProvider: string,
    createdAt: string
}
export const UserInfo = async (data: UserInfointerface): Promise<boolean> => {
    try {
        const response = await fetchApi("/userinfo.do", {
            method: "POST",
            body: JSON.stringify(data)
        })
        return true; // return 값(true 또는 false)을 추가하세요.
    } catch (error) {
        return false;
    }
}