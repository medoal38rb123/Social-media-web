export interface LikeResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  liked: boolean
  likesCount: number
  post: Post
}

export interface Post {
  _id: string
  body: string
  privacy: string
  user: User
  sharedPost: any
  likes: string[]
  createdAt: string
  likesCount: number
  isShare: boolean
  id: string
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface PostLikesResponseType {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  likes: PostLike[]
}

export interface PostLike {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
}

export interface LikeCommentResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  liked: boolean
  likesCount: number
  comment: Comment
}

export interface Comment {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: string[]
  createdAt: string
  likesCount: number
  isReply: boolean
  id: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
