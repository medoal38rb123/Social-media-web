export interface NotificationsResponseType {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  notifications: Notification[]
}

export interface Notification {
  _id: string
  recipient: Recipient
  actor: Actor
  type: string
  entityType: string
  entityId: string
  isRead: boolean
  createdAt: string
  entity: Entity
}

export interface Recipient {
  _id: string
  name: string
  photo: string
}

export interface Actor {
  _id: string
  name: string
  photo: string
}

export interface Entity {
  _id: string
  body?: string
  image?: string
  user?: string
  commentsCount?: number
  topComment?: TopComment
  sharesCount?: number
  likesCount?: number
  isShare?: boolean
  id?: string
  unavailable?: boolean
}

export interface TopComment {
  _id: string
  content?: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: string[]
  createdAt: string
  image?: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
}

export interface Meta {
  feedMode: string
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
  nextPage: number
}

export interface ReadAllNotifications {
  success: boolean
  message: string
  data: ReadAllNotificationsData
}

export interface ReadAllNotificationsData {
  modifiedCount: number
}

export interface UnreadNotificationsCount {
  success: boolean
  message: string
  data: UnreadNotificationsCountData
}

export interface UnreadNotificationsCountData {
  unreadCount: number
}

