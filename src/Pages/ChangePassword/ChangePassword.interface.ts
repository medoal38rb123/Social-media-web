import { ChangePasswordSchema } from './ChangePassword.zod';
import * as zod from 'zod'

export type UserDataType = zod.infer<typeof ChangePasswordSchema>

export interface ChangePasswordResponseType {
  success: boolean
  message: "invalid token .. login again" | "password changed successfully"
  data: Data
  errors: string
}


export interface Data {
  token: string
  tokenType: string
  expiresIn: string
}
