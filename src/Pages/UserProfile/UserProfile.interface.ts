export interface UserProfileResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  isFollowing: boolean
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
  followers: any[]
  following: any[]
  createdAt: string
  passwordChangedAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}


export interface FollowUserResponseType {
  success: boolean
  message: string
  data: FollowData
}

export interface FollowData {
  following: boolean
  followersCount: number
}
