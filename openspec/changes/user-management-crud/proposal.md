## Why

当前系统缺少用户管理功能，无法创建、查询、修改和删除用户账号。需要建立基础的用户 CRUD 能力，为后续的权限管理和业务功能奠定基础。

## What Changes

- 调整 User 数据模型：username 作为唯一登录凭证，email/phone 变为可选且非唯一字段，新增 deletedAt 实现软删除
- 修改身份认证流程：从 email 登录改为 username 登录，软删除用户禁止登录
- 新增用户管理页面：列表展示、服务端分页、按 username/email/phone 筛选
- 实现用户 CRUD 操作：创建用户（固定初始密码 admin123456）、查看/编辑详情、重置密码、软删除
- 新建 `features/user-management/` 模块，包含 Server Actions、UI 组件和 Zod 校验

## Capabilities

### New Capabilities
- `user-crud`: 用户增删改查核心功能，包括创建、列表查询（分页+筛选）、详情查看、编辑、软删除
- `user-password-reset`: 管理员重置用户密码为系统初始密码的独立操作
- `user-soft-delete`: 软删除机制，被删除用户不在列表显示且无法登录

### Modified Capabilities
- `user-authentication`: 登录凭证从 email 改为 username，新增软删除用户的登录拦截

## Impact

**数据库变更**：
- Prisma schema 修改（User 表新增 username/phone/deletedAt，email 改为可选非唯一）
- 需要执行数据库迁移

**认证系统**：
- `auth.ts` 的 `authorize()` 函数需要改用 username 查询并校验 deletedAt

**UI 组件**：
- 需要安装 shadcn/ui 组件：table、dialog、input、form、alert-dialog
- 新增用户管理路由 `/users`

**明确不包含**：
- 权限校验（middleware / checkPermission 不在此次范围）
- 强制首次登录修改密码
- 已删除用户的恢复功能
- 多邮箱/多手机号关系表
