import type { LoginResponseFile, UserDataType } from "./Login.Interface";
import axios from "axios";

export async function sendUserDataLogin(data: UserDataType) {
    try {
        const response = await axios.post<LoginResponseFile>(`${import.meta.env.VITE_BASE_URL}/users/signin`, data);

        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message) 
        }
        throw new Error('Error Error') 
    }
}