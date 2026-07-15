"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function resetUserPassword(
  id: string
): Promise<ActionResult<void>> {
  try {
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

    // 生成固定密码的 hash
    const hashedPassword = await bcrypt.hash("admin123456", 10)

    // 更新密码
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "重置密码失败",
    }
  }
}
