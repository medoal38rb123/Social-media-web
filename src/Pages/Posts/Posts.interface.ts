export interface AllPostsResponseType {
success: boolean;
message: string;
data: {
posts: Post[];
};
meta: {
pagination: Pagination;
};
}

export interface Data {
  posts: Post[];
}

export interface UbdatePostData {
  post: Post;
}

export interface UbdatePostResponseType {
  success: boolean;
  message: string;
  data: UbdatePostData;
}

export interface UbdatedPost {
  _id: string;
  body: string;
  privacy: string;
  user: string;
  sharedPost: any;
  likes: any[];
  createdAt: string;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export interface UbdatePostFormData {
  body: string;
}

export interface Post {
  _id: string;
  body?: string;
  privacy: string;
  user: User;
  sharedPost: Post | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: TopCommentType;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
  image?: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface TopCommentType {
  _id: string;
  content?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
  image?: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
currentPage: number;
numberOfPages: number;
limit: number;
nextPage: number | null;
total: number;
}

export interface HomeFeedResponseType {
success: boolean;
message: string;
data: {
posts: Post[];
};
meta: {
feedMode: string;
pagination: Pagination;
};
}

export interface HomeFeed {
  _id: string
  privacy: string
  user: User
  sharedPost: SharedPost
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
  body?: string
}

export interface SharedPost {
  _id: string
  body: string
  privacy: string
  user: User2
  sharedPost: any
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  image?: string
}

export interface User2 {
  _id: string
  name: string
  username: string
  photo: string
}
