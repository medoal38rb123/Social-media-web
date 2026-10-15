import { axiosInterseptore } from "../AxiosInterseptore";
import type { LikeCommentResponseType, LikeResponseType, PostLikesResponseType } from "./Likes.interface";

export async function LikePost(postId:string) {
    const res = await axiosInterseptore.put<LikeResponseType>(`/posts/${postId}/like`)

    return res.data.data.liked
}

export async function getPostLikes(postId:string) {
    const res = await axiosInterseptore.get<PostLikesResponseType>(`/posts/${postId}/likes`)

    return res.data.data.likes
}

export async function LikeComment({postId, commentId}:{postId:string, commentId:string}) {
    const res = await axiosInterseptore.put<LikeCommentResponseType>(`/posts/${postId}/comments/${commentId}/like`)

    return res.data.data.liked
}

