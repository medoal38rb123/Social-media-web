import { axiosInterseptore } from "../AxiosInterseptore";

export async function getCreatedCommentData(postId: string, data: FormData) {
  const res = await axiosInterseptore.post(`/posts/${postId}/comments`, data);

  return res.data.data.comment;
}
