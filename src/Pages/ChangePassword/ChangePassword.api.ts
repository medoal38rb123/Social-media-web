import axios from "axios";
import type { ChangePasswordResponseType, UserDataType } from "./ChangePassword.interface";

export async function getNewPassword(data: UserDataType) {
    try {
        const res = await axios.patch<ChangePasswordResponseType>(`${import.meta.env.VITE_BASE_URL}/users/change-password`, data, {
            headers: {
                token: localStorage.getItem('user_tkn')
            }
        })

        return res.data
    }catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message) 
        }
        throw new Error('Error Error') 
    }
}