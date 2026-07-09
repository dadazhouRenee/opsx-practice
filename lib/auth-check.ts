import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function checkPermission(permissionCode: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("未授权：请先登录")
  }

  const userPermissions = await prisma.userPermission.findMany({
    where: { userId: session.user.id },
    include: { permission: true },
  })

  const hasPermission = userPermissions.some(
    (up) => up.permission.code === permissionCode
  )

  if (!hasPermission) {
    throw new Error(`未授权：缺少权限 ${permissionCode}`)
  }

  return session.user
}

export async function getUserPermissions(userId: string) {
  const userPermissions = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: true },
  })

  return userPermissions.map((up) => up.permission.code)
}
