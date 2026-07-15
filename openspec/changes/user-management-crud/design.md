## Context

当前系统已有基础的 NextAuth.js 认证框架和 Prisma 数据模型，但用户管理功能缺失。现有 User 模型使用 email 作为唯一标识和登录凭证，无软删除机制。需要调整数据模型以支持 username 登录，并构建完整的用户管理 UI。

## Goals / Non-Goals

**Goals:**
- 建立以 username 为核心的用户标识体系
- 实现服务端分页和筛选的用户列表
- 提供完整的 CRUD 操作和密码重置能力
- 软删除机制保证数据可追溯且不影响业务

**Non-Goals:**
- 权限校验集成（middleware 和 checkPermission 调用）
- 多邮箱/多手机号关系表
- 用户自助注册和密码找回
- 已删除用户的恢复 UI

## Decisions

### 1. 数据模型设计

**决策：username 作为唯一标识，email/phone 降为可选辅助字段**

```prisma
model User {
  id            String    @id @default(cuid())
  username      String    @unique           // 新增：登录凭证
  name          String?                     // 显示名称
  email         String?                     // 改为可选，移除 @unique
  phone         String?                     // 新增：可选
  emailVerified DateTime?                   // 保留，暂不使用
  password      String?
  image         String?
  deletedAt     DateTime?                   // 新增：软删除标记
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  permissions UserPermission[]
}
```

**理由：**
- username 语义更明确作为登录标识，避免 email 既做标识又做联系方式的混淆
- email/phone 非唯一为未来多联系方式扩展留空间（本次不实现关系表）
- deletedAt 采用时间戳而非布尔值，记录删除时间便于审计

**备选方案：**
- ❌ 保持 email 唯一：与"用户可绑定多邮箱"的长期目标冲突
- ❌ 使用 status 枚举：时间戳提供更丰富的信息且更符合事件溯源思维

### 2. 认证流程调整

**决策：修改 auth.ts 的 authorize() 从 username 查询**

```typescript
// auth.ts - authorize() 核心逻辑
const user = await prisma.user.findUnique({
  where: { username: credentials.username as string },
})

if (!user || !user.password || user.deletedAt) {
  return null
}
```

**理由：**
- 直接在认证入口拦截软删除用户，避免会话建立后再校验
- 保持 NextAuth.js 现有流程，最小化改动

### 3. Server Actions 设计

**模块位置：** `features/user-management/actions/`

**核心 Actions 签名：**

```typescript
// 统一返回格式
type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

// 用户列表（服务端分页+筛选）
async function getUsers(params: {
  page: number          // 从 1 开始
  pageSize: number      // 默认 10
  search?: string       // 模糊匹配 username/email/phone
}): Promise<ActionResult<{
  users: User[]
  total: number
  totalPages: number
}>>

// 创建用户
async function createUser(data: {
  username: string
  name?: string
  email?: string
  phone?: string
}): Promise<ActionResult<User>>

// 更新用户
async function updateUser(
  id: string,
  data: { name?: string; email?: string; phone?: string }
): Promise<ActionResult<User>>

// 重置密码
async function resetUserPassword(id: string): Promise<ActionResult<void>>

// 软删除
async function deleteUser(id: string): Promise<ActionResult<void>>
```

**理由：**
- 统一返回格式便于前端错误处理
- search 参数支持三字段模糊查询，Prisma 实现为 `OR` 条件
- 密码固定为 `admin123456`（bcrypt hash），不接受参数避免误用

### 4. UI 架构

**页面路由：** `app/(dashboard)/users/page.tsx`

**组件结构：**
```
features/user-management/components/
├── UserTable.tsx          # 表格 + 分页 + 筛选输入框
├── UserCreateDialog.tsx   # 新增用户弹窗
├── UserDetailDialog.tsx   # 查看/编辑详情抽屉
├── ResetPasswordDialog.tsx # 重置密码二次确认
└── DeleteUserDialog.tsx   # 删除二次确认
```

**使用的 shadcn/ui 组件：**
- `table` - 用户列表
- `dialog` - 新增/详情弹窗
- `input` - 表单输入
- `form` + `react-hook-form` - 表单管理
- `alert-dialog` - 二次确认（重置密码、删除）
- `button` / `label` / `card` - 已有组件复用

**数据流：**
```
UserTable
  ├─ 状态：page, pageSize, search (客户端状态)
  ├─ useEffect → 调用 getUsers() Server Action
  ├─ 渲染表格 + 分页控件
  └─ 操作按钮触发 Dialog 打开
       ├─ Create → UserCreateDialog → createUser()
       ├─ Edit → UserDetailDialog → updateUser()
       ├─ Reset → ResetPasswordDialog → resetUserPassword()
       └─ Delete → DeleteUserDialog → deleteUser()
```

**理由：**
- 客户端管理分页/筛选状态，Server Action 返回当前页数据（避免全量拉取）
- Dialog 组件独立封装便于复用和测试
- 操作成功后关闭 Dialog 并刷新列表（重新调用 getUsers）

### 5. 表单校验

**Zod Schema 位置：** `features/user-management/schemas/user.schema.ts`

```typescript
export const createUserSchema = z.object({
  username: z.string()
    .min(3, "用户名至少 3 个字符")
    .max(20, "用户名最多 20 个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  name: z.string().optional(),
  email: z.string().email("邮箱格式不正确").optional().or(z.literal("")),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确").optional().or(z.literal("")),
})

export const updateUserSchema = createUserSchema.omit({ username: true })
```

**理由：**
- username 严格校验避免特殊字符影响展示和查询
- email/phone 可选但提供格式校验
- 复用 create schema 生成 update schema（username 不可修改）

## Risks / Trade-offs

**[风险] 软删除用户的 email/phone 唯一性冲突**
- 当前设计：email/phone 无唯一约束，允许重复
- 影响：已删除用户的邮箱可被新用户使用，可能导致通知误发（如果后续加邮件功能）
- **缓解：** MVP 阶段不涉及邮件通知，标记为后续需处理项；未来可在应用层校验"未删除用户中邮箱唯一"

**[风险] 固定初始密码 admin123456 的安全性**
- 影响：所有新建用户初始密码相同，知情者可尝试登录其他账号
- **缓解：** 在 proposal 中已明确为已知风险，MVP 阶段接受；生产环境需启用"首次登录强制改密"（不在本次范围）

**[风险] username 不可修改可能影响用户体验**
- 影响：用户名拼写错误或需求变更时只能删除重建
- **缓解：** 与产品确认为可接受的权衡，登录凭证稳定性优先；极端情况可通过数据库直接修改

**[Trade-off] 服务端分页 vs 客户端分页**
- 选择：服务端分页
- 代价：每次筛选/翻页需要 Server Action 请求，可能略慢于客户端内存筛选
- 收益：架构可扩展到大用户量，避免未来重构

**[Trade-off] 软删除用户不可恢复（UI 层面）**
- 选择：本次不提供恢复入口
- 代价：误删需数据库手动操作或等待权限功能完善
- 收益：MVP 范围可控，避免复杂的"回收站"交互设计

## Migration Plan

**步骤 1：数据库迁移**
```bash
npx prisma migrate dev --name add_username_and_soft_delete
```

**步骤 2：登录流程更新**
- 修改 `auth.ts` 后，现有会话（如果有）不受影响
- 新登录使用 username 而非 email
- 登录页面需同步修改输入框 label（email → username）

**步骤 3：UI 部署**
- 用户管理页面为新增路由，不影响现有功能
- 侧边栏新增"用户管理"入口（需修改 `components/layout/sidebar.tsx`）

**回滚策略：**
- 如果发现重大问题，可通过 Prisma migrate 回滚数据库变更
- auth.ts 改动可直接 git revert
- UI 部分为纯新增，移除路由即可

## Open Questions

暂无。所有设计决策已在探索阶段与用户确认。
