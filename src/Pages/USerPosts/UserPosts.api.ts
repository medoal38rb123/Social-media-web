import { axiosInterseptore } from "../../Components/AxiosInterseptore";
import type { UserPostsResponseType } from "./UserPosts.interface";

export async function getUserPosts(userId:string) {
    const res = await axiosInterseptore.get<UserPostsResponseType>(`/users/${userId}/posts`)
    return res.data.data.posts
}