import axios from "axios";
import type { RegisterResponseFile, UserDataType } from "./Register.Interface";

export async function sendUserDataRegister(data: UserDataType) {
    try {
        const response = await axios.post<RegisterResponseFile>(`${import.meta.env.VITE_BASE_URL}/users/signup`, data);

        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message) 
        }
        throw new Error('Error Error') 
    }
}