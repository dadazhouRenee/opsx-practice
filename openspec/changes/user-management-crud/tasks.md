## 1. 数据库模型变更

- [x] 1.1 修改 `prisma/schema.prisma`：User 表新增 username（String @unique）、phone（String?）、deletedAt（DateTime?），email 改为可选（String?）并移除 @unique
- [x] 1.2 执行数据库迁移：`npx prisma migrate dev --name add_username_and_soft_delete`
- [x] 1.3 验证迁移成功：检查 `prisma/migrations/` 生成的迁移文件

## 2. 身份认证调整

- [x] 2.1 修改 `auth.ts`：authorize() 函数从 `findUnique({ where: { email } })` 改为 `findUnique({ where: { username } })`
- [x] 2.2 在 authorize() 中添加软删除校验：`if (user.deletedAt) return null`
- [x] 2.3 修改登录页面 `app/login/page.tsx`（如存在）：输入框从 email 改为 username，label 和 placeholder 对应调整

## 3. 创建 user-management 模块结构

- [x] 3.1 创建目录：`features/user-management/actions/`、`features/user-management/components/`、`features/user-management/schemas/`
- [x] 3.2 创建 `features/user-management/types.ts`：定义 User 相关 TypeScript 类型（如需要）

## 4. Zod 校验 Schema

- [x] 4.1 创建 `features/user-management/schemas/user.schema.ts`：定义 createUserSchema（username 必填 3-20字符正则校验，name/email/phone 可选格式校验）
- [x] 4.2 在同文件定义 updateUserSchema：复用 createUserSchema 并 omit username 字段

## 5. Server Actions 实现

- [x] 5.1 创建 `features/user-management/actions/get-users.ts`：实现 getUsers(page, pageSize, search)，返回 { users, total, totalPages }，查询条件包含 deletedAt: null 和 OR 筛选三字段
- [x] 5.2 创建 `features/user-management/actions/create-user.ts`：实现 createUser()，Zod 校验后插入记录，password 固定为 bcrypt.hash("admin123456", 10)
- [x] 5.3 创建 `features/user-management/actions/update-user.ts`：实现 updateUser(id, data)，Zod 校验后更新 name/email/phone，不允许修改 username
- [x] 5.4 创建 `features/user-management/actions/reset-password.ts`：实现 resetUserPassword(id)，更新 password 为 admin123456 的 bcrypt hash
- [x] 5.5 创建 `features/user-management/actions/delete-user.ts`：实现 deleteUser(id)，设置 deletedAt 为当前时间（软删除）

## 6. 安装 shadcn/ui 组件

- [x] 6.1 安装 table 组件：`npx shadcn@latest add table`
- [x] 6.2 安装 dialog 组件：`npx shadcn@latest add dialog`
- [x] 6.3 安装 input 组件：`npx shadcn@latest add input`
- [x] 6.4 安装 form 组件（包含 react-hook-form 集成）：`npx shadcn@latest add form`
- [x] 6.5 安装 alert-dialog 组件：`npx shadcn@latest add alert-dialog`

## 7. UI 组件开发

- [x] 7.1 创建 `features/user-management/components/UserTable.tsx`：实现用户列表表格，包含搜索输入框、分页控件、调用 getUsers() Server Action
- [x] 7.2 创建 `features/user-management/components/UserCreateDialog.tsx`：实现新增用户弹窗表单（username/name/email/phone），调用 createUser()
- [x] 7.3 创建 `features/user-management/components/UserDetailDialog.tsx`：实现查看/编辑用户抽屉，username 只读显示，其他字段可编辑，调用 updateUser()
- [x] 7.4 创建 `features/user-management/components/ResetPasswordDialog.tsx`：实现重置密码二次确认弹窗，调用 resetUserPassword()
- [x] 7.5 创建 `features/user-management/components/DeleteUserDialog.tsx`：实现删除用户二次确认弹窗，调用 deleteUser()

## 8. 用户管理页面集成

- [x] 8.1 创建 `app/(dashboard)/users/page.tsx`：用户管理主页面，导入并渲染 UserTable 组件
- [x] 8.2 修改 `components/layout/sidebar.tsx`：添加"用户管理"导航链接指向 /users 路由

## 9. 测试验证

- [x] 9.1 启动开发服务器：`npm run dev`
- [x] 9.2 测试创建用户：验证 username 唯一性校验、email/phone 格式校验、初始密码生成
- [x] 9.3 测试列表查询：验证分页功能、搜索三字段筛选、软删除用户不显示
- [x] 9.4 测试编辑用户：验证 username 不可修改、其他字段可更新、可选字段可清空
- [x] 9.5 测试重置密码：验证二次确认弹窗、密码重置成功、新密码可登录
- [x] 9.6 测试软删除：验证二次确认弹窗、用户从列表消失、被删除用户无法登录
- [x] 9.7 测试登录流程：验证 username 登录、软删除用户被拒绝、登录页面显示调整
