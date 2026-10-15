
import { axiosInterseptore } from "../AxiosInterseptore";
import type { SharePostResponseType } from "./SharePost.interface";

export async function sharePostApi({
  postId,
  data,
}: {
  postId: string;
  data: FormData;
}) {
  const res = await axiosInterseptore.post<SharePostResponseType>(
    `/posts/${postId}/share`,
    data,
  );

  return res.data.data.post;
}
