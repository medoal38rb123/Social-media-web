import * as zod from 'zod'

export const registerSchema = zod.object({
    name: zod.string().regex(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' \-]+$/, 'Invalid name'), 
    username: zod.string().regex(/(^[a-z0-9_-]{3,15}$)/, 'Invalid user name'), 
    email: zod.string().email('Email is not correct'), 
    password: zod.string().regex(/(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$)/, 'Invalid password'), 
    rePassword: zod.string().regex(/(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$)/, ''), 
    dateOfBirth: zod.string().refine(function(value) {
        const currentDate = new Date()
        const userDate = new Date(value)

        return currentDate.getFullYear() - userDate.getFullYear() > 18
        
    }, {
        message: 'Your Age Must Be Above 21 Years old'
    }),
    gender: zod.enum(["male", "female"])
}).refine(function(value) {
    return value.password === value.rePassword
},
    {path: ["rePassword"],
    message : "Password do not match"
})