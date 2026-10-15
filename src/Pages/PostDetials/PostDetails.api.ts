import type { PostDetailsResponseType } from "./PostDetails.interface";
import { axiosInterseptore } from "../../Components/AxiosInterseptore";

export async function getPostDetails(postId:string) {
    const res = await axiosInterseptore.get<PostDetailsResponseType>(`/posts/${postId}`)
    return res.data.data.post
}
