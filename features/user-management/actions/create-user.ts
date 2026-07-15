"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createUserSchema, type CreateUserInput } from "../schemas/user.schema"

type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function createUser(
  input: CreateUserInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Zod 校验
    const validatedData = createUserSchema.parse(input)

    // 检查 username 是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username },
    })

    if (existingUser) {
      return {
        success: false,
        error: "用户名已存在",
      }
    }

    // 生成固定初始密码的 hash
    const hashedPassword = await bcrypt.hash("admin123456", 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        name: validatedData.name || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        password: hashedPassword,
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
      error: error instanceof Error ? error.message : "创建用户失败",
    }
  }
}
