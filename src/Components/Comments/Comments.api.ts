import type { AllCommentsResponseType, CommentReplyResponseType, CreateReplyResponseType } from "./Comments.interface";
import { axiosInterseptore } from "../AxiosInterseptore";

export async function getAllComments(postId:string) {
    const res = await axiosInterseptore.get<AllCommentsResponseType>(`/posts/${postId}/comments?page=1&limit=10`)
    return res.data.data.comments
}

export async function getCommentReplies({postId, commentId}:{postId:string, commentId:string}) {
    const res = await axiosInterseptore.get<CommentReplyResponseType>(`/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`)
    return res.data.data.replies
}

export async function createReply({postId, commentId, data}:{postId:string, commentId:string, data:FormData}) {
    const res = await axiosInterseptore.post<CreateReplyResponseType>(`/posts/${postId}/comments/${commentId}/replies`, data)
    return res.data.data.replies
}

export async function deleteComment({postId, commentId}:{postId:string, commentId:string}) {
    const res = await axiosInterseptore.delete<AllCommentsResponseType>(`/posts/${postId}/comments/${commentId}`)
    return res.data.data.comments
}

export async function editComment({postId, commentId, data}:{postId:string, commentId:string, data:FormData}) {
    const res = await axiosInterseptore.put<AllCommentsResponseType>(`/posts/${postId}/comments/${commentId}`, data)
    return res.data.data.comments
}
