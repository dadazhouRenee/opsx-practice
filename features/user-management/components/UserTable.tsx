"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getUsers } from "../actions/get-users"
import { UserCreateDialog } from "./UserCreateDialog"
import { UserDetailDialog } from "./UserDetailDialog"
import { ResetPasswordDialog } from "./ResetPasswordDialog"
import { DeleteUserDialog } from "./DeleteUserDialog"
import { Search, Plus } from "lucide-react"

type User = {
  id: string
  username: string
  name: string | null
  email: string | null
  phone: string | null
  createdAt: Date
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const pageSize = 10

  const loadUsers = async () => {
    setLoading(true)
    const result = await getUsers({ page, pageSize, search: search || undefined })
    setLoading(false)

    if (result.success && result.data) {
      setUsers(result.data.users)
      setTotal(result.data.total)
      setTotalPages(result.data.totalPages)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page, search])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // 重置到第一页
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setDetailDialogOpen(true)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setResetPasswordDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("zh-CN")
  }

  return (
    <div className="space-y-4">
      {/* 搜索和新增 */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索用户名、邮箱或手机号..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增用户
        </Button>
      </div>

      {/* 用户表格 */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name || "-"}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        查看
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                      >
                        重置密码
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {total} 条记录，第 {page} / {totalPages} 页
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 对话框 */}
      <UserCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadUsers}
      />

      {selectedUser && (
        <>
          <UserDetailDialog
            user={selectedUser}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            onSuccess={loadUsers}
          />

          <ResetPasswordDialog
            user={selectedUser}
            open={resetPasswordDialogOpen}
            onOpenChange={setResetPasswordDialogOpen}
            onSuccess={loadUsers}
          />

          <DeleteUserDialog
            user={selectedUser}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={loadUsers}
          />
        </>
      )}
    </div>
  )
}
