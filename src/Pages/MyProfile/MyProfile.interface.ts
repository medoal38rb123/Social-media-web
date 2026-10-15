export interface changePhotoResponseType {
  data: Data
  message: string
  success: boolean
}

export interface Data {
  photo: string
  postId: string
}

export interface followType {
  isFollow: boolean | null
  setIsFollow: React.Dispatch<React.SetStateAction<boolean | null>>
}

export interface MyProfileResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  user: User
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  cover: string
  bookmarks: any[]
  followers: any[]
  following: any[]
  createdAt: string
  passwordChangedAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
