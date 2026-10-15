import * as zod from "zod"

export const ChangePasswordSchema = zod.object({
    password: zod.string().regex(/(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$)/, 'Invalid password'),
    newPassword: zod.string().regex(/(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$)/, 'Invalid password')
})