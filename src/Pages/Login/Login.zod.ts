import * as zod from 'zod'

export const loginSchema = zod.object({
    email: zod.string().email('Email is not correct'), 
    password: zod.string().regex(/(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$)/, 'Invalid password')
})