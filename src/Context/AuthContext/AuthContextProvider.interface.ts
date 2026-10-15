export interface AuthContextType {
  currentUser: UserData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  isLoading: boolean;
}

export interface userDataResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  user: UserData
}

export interface UserData {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth?: string
  gender?: string
  photo: string
  cover: string
  bookmarks?: any[]
  followers?: any[]
  following?: any[]
  createdAt?: string
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
  id?: string
}
