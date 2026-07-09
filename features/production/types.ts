// Production 模块类型定义

import { z } from "zod"

// 物料相关类型
export interface Item {
  id: string
  code: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

// 工单相关类型
export interface WorkOrder {
  id: string
  code: string
  itemId: string
  quantity: number
  status: "pending" | "in_progress" | "completed"
  createdAt: Date
  updatedAt: Date
}

// 生产报工相关类型
export interface ProductionReport {
  id: string
  workOrderId: string
  quantity: number
  operatorId: string
  reportedAt: Date
}

// Server Action 返回类型
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
