import axios from "axios";
import type { CreatePostResponseType } from "./CreatePost.interface";

export async function getCreatedPostData(dataForm:FormData) {
    try {
        const res = await axios.post<CreatePostResponseType>(`${import.meta.env.VITE_BASE_URL}/posts`, dataForm, {
            headers: {
                token: localStorage.getItem('user_tkn')
            }
        })
        return res.data.data.post
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message) 
        }
        throw new Error('Error Error') 
    }
}