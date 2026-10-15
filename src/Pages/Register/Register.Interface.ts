import * as zod from 'zod'
import type { registerSchema } from './Register.zod'

export type UserDataType = zod.infer<typeof registerSchema>

export interface RegisterResponseFile {
  success: boolean
  message: 'account created' | 'user already exists.'
  data: Data
  errors: string
}

export interface Data {
  token: string
  tokenType: string
  expiresIn: string
  user: User
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  photo: string
  cover: string
}
