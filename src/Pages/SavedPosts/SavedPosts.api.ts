import { axiosInterseptore } from "../../Components/AxiosInterseptore";
import type { BookMarksResponseType, SavePostResponseType } from "./SavedPosts.interface";

export async function getBookmarksPosts() {
    const res = await axiosInterseptore.get<BookMarksResponseType>(`/users/bookmarks`)
    return res.data.data.bookmarks
}

export async function savePost(postId:string) {
    const res = await axiosInterseptore.put<SavePostResponseType>(`/posts/${postId}/bookmark`)
    return res.data.data.bookmarked
}