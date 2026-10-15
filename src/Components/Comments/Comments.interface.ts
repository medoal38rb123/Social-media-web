export interface AllCommentsResponseType {
  success: boolean
  message: string
  data: CommentData
  meta: Meta
}

export interface CommentData {
  comments: Comment[]
}

export interface Comment {
  _id: string
  content: string
  image: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: any[]
  createdAt: string
  repliesCount: number
}

export interface CommentReplyResponseType {
  success: boolean
  message: string
  data: RepliesData
}

export interface RepliesData {
  replies: Reply[]
}

export interface Reply {
  _id: string
  content: string
  image: string
  commentCreator: CommentCreator
  post: string
  parentComment: string
  likes: any[]
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


export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
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

export interface CreateReplyFormData {
  content: string;
  image: FileList | null;
}


export interface CreateReplyResponseType {
  success: boolean
  message: string
  data: CreateReplyData
}

export interface CreateReplyData {
  replies: Reply[]
}
