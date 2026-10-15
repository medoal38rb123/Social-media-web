import * as zod from 'zod'
import type { loginSchema } from './Login.zod'

export type UserDataType = zod.infer<typeof loginSchema>

export interface LoginResponseFile {
  success: boolean
  message: 'signed in successfully' | 'incorrect email or password'
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
