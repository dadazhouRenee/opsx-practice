"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateUser } from "../actions/update-user"
import { updateUserSchema, type UpdateUserInput } from "../schemas/user.schema"

type User = {
  id: string
  username: string
  name: string | null
  email: string | null
  phone: string | null
  createdAt: Date
}

type UserDetailDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserDetailDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
      setIsEditing(false)
      setError(null)
    }
  }, [open, user, form])

  const onSubmit = async (data: UpdateUserInput) => {
    setLoading(true)
    setError(null)

    const result = await updateUser(user.id, data)

    setLoading(false)

    if (result.success) {
      setIsEditing(false)
      onOpenChange(false)
      onSuccess()
    } else {
      setError(result.error || "更新用户失败")
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!loading) {
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑用户" : "用户详情"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "修改用户信息" : "查看用户详细信息"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input value={user.username} disabled />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入姓名"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入邮箱"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入手机号"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>创建时间</FormLabel>
              <FormControl>
                <Input
                  value={new Date(user.createdAt).toLocaleString("zh-CN")}
                  disabled
                />
              </FormControl>
            </FormItem>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <DialogFooter>
              {!isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    关闭
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    编辑
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    取消
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "保存中..." : "保存"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
