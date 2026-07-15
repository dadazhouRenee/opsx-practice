"use server"

import prisma from "@/lib/prisma"
import { updateUserSchema, type UpdateUserInput } from "../schemas/user.schema"

type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Zod 校验
    const validatedData = updateUserSchema.parse(input)

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser || existingUser.deletedAt) {
      return {
        success: false,
        error: "用户不存在",
      }
    }

    // 更新用户
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: validatedData.name || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
      },
    })

    return {
      success: true,
      data: { id: user.id },
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "输入数据格式不正确",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "更新用户失败",
    }
  }
}
