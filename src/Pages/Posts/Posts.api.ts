import axios from "axios";
import { axiosInterseptore } from "../../Components/AxiosInterseptore";
import type {
  AllPostsResponseType,
  HomeFeedResponseType,
  UbdatePostResponseType,
} from "./Posts.interface";

export async function getAllPosts(page: number) {
  try {
    const res = await axiosInterseptore.get<AllPostsResponseType>("/posts", {
      params: {
        page,
      },
    });
    
    return {
      post: res.data.data.posts,
      pages: res.data.meta.pagination.numberOfPages,
    };
  } catch (errors) {
    if (axios.isAxiosError(errors)) {
      throw new Error(errors.response?.data.message);
    }
    throw new Error("Error Error");
  }
}

export async function deletePost(postId: string) {
  const res = await axiosInterseptore.delete<AllPostsResponseType>(
    `/posts/${postId}`,
  );
  return res.data.data.posts;
}

export async function ubdatePost({
  postId,
  data,
}: {
  postId: string;
  data: FormData;
}) {
  const res = await axiosInterseptore.put<UbdatePostResponseType>(
    `/posts/${postId}`,
    data,
  );
  return res.data.data.post;
}

export async function getHomeFeed(page: number) {
  const res = await axiosInterseptore.get<HomeFeedResponseType>(
    `/posts/feed?only=following&limit=10&page=${page}`
  );

  return {
    post: res.data.data.posts,
    pages: res.data.meta.pagination.numberOfPages,
  };
}