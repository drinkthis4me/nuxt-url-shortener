import { z } from 'zod'

// Atomic fields
const password = z.string().min(8, 'Password must be at least 8 characters')
const name = z.string().min(1, 'Name must be at least 1 character').trim()
const email = z.email('Email is invalid')

// Shared base schema
const userBase = z.object({
  name: name.optional(),
  email,
})

// Schema for Registration/Create (Public)
export const userCreateSchema = userBase.extend({
  password,
})
export type UserCreateSchema = z.output<typeof userCreateSchema>

// Schema for Update/Patch (Public)
export const userUpdateSchema = userBase.partial().extend({
  password: password.optional(),
})
export type UserUpdateSchema = z.output<typeof userUpdateSchema>

// Schema for Select by id (Delete/Get)
export const userIdSchema = z.object({
  id: z.coerce.number(),
})

// Schema for login
export const userLoginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})
export type UserLoginSchema = z.output<typeof userLoginSchema>

// Schema for Internal DB representation
export const userDBSchema = userBase.extend({
  id: z.number(),
  password: z.string(),
  createdAt: z.coerce.date(),
  isActive: z.boolean(),
})
