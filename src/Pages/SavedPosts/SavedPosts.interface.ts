export interface BookMarksResponseType {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  bookmarks: Bookmark[]
}

export interface Bookmark {
  _id: string
  body: string
  image: string
  privacy: string
  user: User
  sharedPost: any
  likes: any[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}

export interface User {
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

export interface SavePostResponseType {
  success: boolean
  message: string
  data: SavePostData
}

export interface SavePostData {
  bookmarked: boolean
  bookmarksCount: number
}
