import { z } from "zod"

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少 3 个字符")
    .max(20, "用户名最多 20 个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  name: z.string().optional(),
  email: z
    .string()
    .email("邮箱格式不正确")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "手机号格式不正确")
    .optional()
    .or(z.literal("")),
})

export const updateUserSchema = createUserSchema.omit({ username: true })

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
