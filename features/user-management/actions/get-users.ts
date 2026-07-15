"use server"

import prisma from "@/lib/prisma"

type GetUsersParams = {
  page: number
  pageSize: number
  search?: string
}

type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function getUsers(params: GetUsersParams): Promise<
  ActionResult<{
    users: Array<{
      id: string
      username: string
      name: string | null
      email: string | null
      phone: string | null
      createdAt: Date
    }>
    total: number
    totalPages: number
  }>
> {
  try {
    const { page, pageSize, search } = params

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    return {
      success: true,
      data: {
        users,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取用户列表失败",
    }
  }
}
