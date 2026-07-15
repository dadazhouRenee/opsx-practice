import { UserTable } from "@/features/user-management/components/UserTable"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">用户管理</h1>
        <p className="text-muted-foreground mt-2">
          管理系统用户账号
        </p>
      </div>

      <UserTable />
    </div>
  )
}
