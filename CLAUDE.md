# 项目：MES 管理系统 (MVP)

## 1. 项目愿景
构建一个轻量级、高度模块化的制造执行系统 (MES) MVP。
- **核心目标**: 实现从“人员管理”到“生产执行”的最小闭环。
- **设计哲学**: 极致精简的 RBAC 权限体系，顺滑的 AI 辅助开发体验，代码逻辑高度模块化。

## 2. 技术栈原则
- **框架**: Next.js (App Router)
- **语言**: TypeScript (Strict Mode)
- **数据库**: SQLite (Prisma ORM)
- **身份认证**: NextAuth.js v5
- **校验**: Zod (表单与 API 校验)
- **样式**: Tailwind CSS + shadcn/ui
- **数据获取**: Server Actions (无客户端状态库)

## 3. MVP 核心功能模块
- **身份认证与权限系统**:
  - NextAuth.js 处理登录/登出/会话管理。
  - 权限点定义采用"资源:动作"格式 (如 `user:create`, `workorder:read`)。
  - 用户与权限字符串直接绑定（无 Role 中间层）。
  - Middleware 统一校验页面级权限，Server Actions 内部校验操作级权限。
- **生产执行基础**:
  - 物料管理 (Item) 与 生产工单 (Work Order)。
  - 核心闭环：工单下达 -> 生产报工 -> 进度查询。

## 4. MVP 最小功能集
1. 用户能登录系统（NextAuth.js）
2. 管理员能创建用户并分配权限（User + Permission 绑定）
3. 能创建物料（Item CRUD）
4. 能创建工单（Work Order CRUD）
5. 能对工单进行报工（记录生产进度）
6. 能查看工单进度（列表 + 详情）

**不包含**: 用户自助注册、密码重置、角色管理、组织架构、数据导入导出、操作日志。

## 5. 目录结构规范

采用 Feature-based 架构：

```
demo-opsx-01/
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth.js API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── features/              # Feature-based 架构
│   ├── auth/             # 身份认证模块
│   │   ├── actions/      # Server Actions
│   │   ├── components/   # UI 组件
│   │   ├── schemas/      # Zod Schema
│   │   └── types.ts      # 模块类型定义
│   └── production/       # 生产执行模块
│       ├── actions/
│       ├── components/
│       ├── schemas/
│       └── types.ts
├── components/           # 全局共享组件
│   └── ui/              # shadcn/ui 组件
├── lib/                 # 核心工具库
│   ├── prisma.ts       # Prisma Client 单例
│   ├── auth-check.ts   # 权限校验
│   ├── utils.ts        # 工具函数
│   └── types.ts        # 全局类型定义
├── prisma/
│   ├── schema.prisma   # 数据库模型
│   └── migrations/     # 数据库迁移（需提交）
├── docs/               # 项目文档
├── auth.ts             # NextAuth.js 配置（根目录约定）
├── middleware.ts       # Next.js Middleware
└── .env                # 环境变量（不提交）
```

**类型定义组织原则**：
- 模块相关类型放在 `features/[module]/types.ts`
- 全局共享类型放在 `lib/types.ts`
- 避免创建集中式 `types/` 文件夹

**AI 工具配置:**
- `.agents/skills/` - AI 工具 skills 统一存储目录
- `.claude/skills` 和 `.codex/skills` - 通过符号链接指向 `.agents/skills`
- 首次 clone 后运行: `.\setup-skills.ps1` 创建本地符号链接

**推荐使用的 AI Skills:**
- `/frontend-design` - 创建高质量 UI 组件和页面
- `/react-best-practices` - React/Next.js 性能优化和最佳实践
- `/code-review` - 代码审查（提交前使用）
- `/verify` - 验证代码变更是否真正工作（端到端测试）
- `/simplify` - 简化和优化代码

## 6. 开发规范 (Vibe Coding)
- **原子化**: 组件逻辑保持纯粹。
- **Server Actions**: 严禁在客户端写 DB 逻辑，操作封装在 `actions/`。
- **最小化原则**: 优先实现功能闭环，后续通过迭代增加 Role 角色和组织架构等复杂模型。
- **AI 协作**: 当生成复杂逻辑时，请先进行伪代码设计，确保符合架构规范。

## 7. 命名约定
- **Components**: PascalCase (e.g., `WorkOrderForm.tsx`)
- **Functions/Hooks**: camelCase (e.g., `useProductionStatus.ts`, `createWorkOrder.ts`)

## 8. 技术栈最佳实践

### Prisma 数据库管理
- **Schema 变更流程**:
  1. 修改 `prisma/schema.prisma`
  2. 运行 `npx prisma migrate dev --name <描述性名称>` 创建迁移
  3. 自动生成的 Prisma Client 会更新，无需手动操作
- **查询优化**: 使用 `select` 和 `include` 精确控制返回字段，避免过度查询
- **事务处理**: 涉及多表操作时使用 `prisma.$transaction()`

### NextAuth.js 权限管理
- **权限校验**: 所有 Server Actions 必须在函数开头调用权限校验
  ```typescript
  // 示例：actions/user.ts
  'use server'
  import { checkPermission } from '@/lib/auth-check'
  
  export async function createUser(data: UserInput) {
    await checkPermission('user:create')
    // 业务逻辑...
  }
  ```
- **会话获取**: 使用 `auth()` 获取当前会话（App Router）
- **权限粒度**: 权限点格式严格遵循 `资源:动作`（如 `user:create`, `workorder:read`）

### Zod 表单校验
- **Schema 共享**: 在 `features/[module]/schemas/` 定义 Zod Schema，服务端和客户端共享
- **类型推导**: 使用 `z.infer<typeof schema>` 自动生成 TypeScript 类型
- **错误处理**: Server Actions 返回的错误应包含 Zod 验证错误信息

### shadcn/ui 组件使用
- **添加新组件**: `npx shadcn-ui@latest add [component-name]`
- **自定义样式**: 直接修改 `components/ui/` 中的组件文件，不要创建 wrapper
- **主题配置**: 通过 `tailwind.config.ts` 和 `globals.css` 统一管理颜色和样式变量

### Server Actions 规范
- **文件位置**: 放在 `features/[module]/actions/` 目录
- **'use server' 指令**: 必须在文件顶部声明
- **返回格式**: 统一返回 `{ success: boolean, data?: T, error?: string }`
- **错误处理**: 使用 try-catch 捕获异常，返回友好错误信息而非抛出异常

### TypeScript Strict Mode
- **避免 any**: 使用 `unknown` 或具体类型
- **空值处理**: 明确处理 `null` 和 `undefined`，使用可选链 `?.` 和空值合并 `??`
- **类型守卫**: 复杂类型判断使用类型守卫函数

## 9. 环境配置

### 环境变量
`.env` 文件配置（不提交到 Git）：
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Git 版本控制
**需要提交**：
- `prisma/schema.prisma` - 数据模型定义
- `prisma/migrations/` - 数据库迁移历史
- `.env.example` - 环境变量模板

**不提交**：
- `.env` - 真实环境变量
- `prisma/*.db` - SQLite 数据库文件
- `prisma/*.db-journal` - SQLite 日志文件
- `node_modules/` - 依赖包

### 开发流程
1. **首次启动**：
   ```bash
   npm install
   cp .env.example .env
   npx prisma migrate dev
   npm run dev
   ```

2. **数据库变更**：
   ```bash
   # 修改 prisma/schema.prisma
   npx prisma migrate dev --name <描述性名称>
   ```

3. **团队协作**：
   - 拉取最新代码后运行 `npx prisma migrate dev` 同步数据库
   - 提交时确保 migrations/ 文件夹包含在内