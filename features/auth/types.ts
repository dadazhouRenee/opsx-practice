// Auth 模块类型定义

import { z } from "zod"

// 用户相关类型
export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  password: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  id: string
  code: string // 格式：resource:action
  description: string | null
  createdAt: Date
}

export interface UserPermission {
  id: string
  userId: string
  permissionId: string
  createdAt: Date
}

// Server Action 返回类型
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
