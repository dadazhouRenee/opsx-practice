## Context

当前系统处于 MVP 初期阶段，`components/ui/` 目录为空，尚未安装任何 shadcn/ui 组件。现有布局仅包含基础的 `app/layout.tsx` 和 `app/page.tsx`，无导航结构。`globals.css` 已配置基础的 `:root` 和 `.dark` CSS 变量，但仅用于 shadcn/ui 的默认配置，未实际启用明暗切换。

这是系统首次构建真正的 UI 基础设施，主题系统将成为所有后续功能的视觉基础。需要在不破坏现有架构原则（Feature-based、Server Actions、TypeScript Strict）的前提下，引入客户端主题管理能力。

## Goals / Non-Goals

**Goals:**
- 实现明暗主题切换，支持浅色和深色两种模式
- 实现主色调选择器，提供 6 种颜色（蓝、绿、紫、橙、青、靛蓝）
- 构建 Dashboard 布局系统（Header + Sidebar + Main）
- 创建 `/settings` 页面展示主题配置和组件预览
- localStorage 持久化用户主题偏好
- 零闪烁的 SSR/CSR 主题同步

**Non-Goals:**
- 不支持"跟随系统"主题模式（仅 Light/Dark 两选项）
- 不支持用户自定义颜色（仅预设的 6 种）
- 不实现主题的服务端存储（无需数据库，localStorage 即可）
- 不构建复杂的 Sidebar 折叠/展开逻辑（固定宽度即可）
- 不实现主题动画过渡效果（MVP 阶段保持简单）

## Decisions

### 1. 明暗切换：使用 next-themes 库

**决策**：采用 `next-themes` 处理明暗主题切换，而非自己实现。

**理由**：
- ✅ 社区标准方案，专门为 Next.js 设计
- ✅ 自动处理 SSR hydration，通过 script 标签注入避免闪烁
- ✅ 内置 localStorage 同步
- ✅ 简化代码，减少自定义逻辑的维护成本

**替代方案**：
- ❌ 自定义 ThemeProvider：需要处理复杂的 SSR hydration，容易出现首屏闪烁

### 2. 主色调切换：自定义 ColorThemeProvider

**决策**：主色调切换单独实现一个 `ColorThemeProvider`，与 `next-themes` 分层。

**理由**：
- ✅ 职责分离：`next-themes` 管理明暗，`ColorThemeProvider` 管理颜色
- ✅ 简化逻辑：主色调切换不涉及 SSR 复杂性，localStorage 读写即可
- ✅ 灵活性：未来可独立扩展颜色选项，不影响明暗切换

**实现方案**：
```typescript
// 状态管理
<ThemeProvider>           // from next-themes，管理 .dark class
  <ColorThemeProvider>    // 自定义，管理 data-theme 属性
    <App />
  </ColorThemeProvider>
</ThemeProvider>

// HTML 最终状态
<html class="dark" data-theme="green">
```

### 3. CSS 变量架构：分层设计

**决策**：中性色（background, foreground）保持在 `:root` 和 `.dark`，主色调仅覆盖 `--primary` 和 `--primary-foreground`。

**CSS 结构**：
```css
/* 中性色：跟随明暗模式 */
:root { --background: white; --foreground: black; ... }
.dark { --background: black; --foreground: white; ... }

/* 主色调：通过 data-theme 属性 */
[data-theme="blue"]    { --primary: 217 91% 60%; --primary-foreground: 0 0% 100%; }
[data-theme="green"]   { --primary: 142 71% 45%; --primary-foreground: 0 0% 100%; }
[data-theme="purple"]  { --primary: 262 83% 58%; --primary-foreground: 0 0% 100%; }
[data-theme="orange"]  { --primary: 25 95% 53%;  --primary-foreground: 0 0% 100%; }
[data-theme="cyan"]    { --primary: 189 94% 43%; --primary-foreground: 0 0% 100%; }
[data-theme="indigo"]  { --primary: 239 84% 67%; --primary-foreground: 0 0% 100%; }
```

**理由**：
- ✅ 职责清晰：明暗模式控制整体色调，主色调只影响强调色
- ✅ 避免变量爆炸：不需要为每个颜色定义完整的 16+ 个 CSS 变量
- ✅ 统一感：所有主题的中性色保持一致，只有强调色变化

**替代方案**：
- ❌ 每个主题定义完整变量集：会产生 6×16=96 个变量定义，维护成本高

### 4. 布局系统：Dashboard Layout Pattern

**决策**：采用经典的后台管理布局（Header + Sidebar + Main），通过路由组 `(dashboard)` 包裹。

**目录结构**：
```
app/
├── layout.tsx                    # 根布局（ThemeProvider）
├── (dashboard)/                  # 路由组
│   ├── layout.tsx               # DashboardLayout 包裹
│   ├── page.tsx                 # 首页
│   └── settings/page.tsx        # 设置页
└── (auth)/                       # 未来的认证路由组（登录页无 Dashboard）
    └── login/page.tsx
```

**理由**：
- ✅ 路由组隔离：Dashboard 页面和认证页面使用不同布局
- ✅ 符合 Next.js 最佳实践
- ✅ 为未来扩展预留空间（认证页面不需要 Sidebar）

### 5. Sidebar 菜单数据：硬编码配置

**决策**：Sidebar 菜单项暂时硬编码在 `sidebar.tsx` 组件中，不使用外部配置文件。

**菜单项**：
```typescript
const menuItems = [
  { icon: Home, label: '首页', href: '/' },
  { icon: Settings, label: '设置', href: '/settings' },
];
```

**理由**：
- ✅ MVP 原则：菜单项数量少，硬编码更简单直接
- ✅ 无需权限控制：当前阶段所有页面对所有用户可见
- ✅ 未来可扩展：需要权限控制时再抽取为配置 + 过滤逻辑

**替代方案**：
- ❌ 外部配置文件：当前阶段过度设计
- ❌ 基于权限动态生成：当前无权限需求

### 6. shadcn/ui 组件安装策略

**决策**：按需安装组件，而非一次性安装全部。

**首批安装**：
```bash
npx shadcn-ui@latest add button card select alert label
```

**理由**：
- ✅ 减少依赖体积
- ✅ 明确当前实际使用的组件
- ✅ 未来需要其他组件时再安装

## Risks / Trade-offs

### 1. 主题闪烁风险

**风险**：主色调切换（ColorThemeProvider）可能在首屏出现短暂闪烁，因为 localStorage 读取发生在客户端 mount 后。

**缓解措施**：
- 设置合理的默认主题（蓝色），大部分用户使用默认值不会闪烁
- 接受轻微闪烁作为 MVP 阶段的权衡（避免引入复杂的 script 注入逻辑）
- 未来可优化：通过 `next-themes` 的 script 注入机制同时处理颜色主题

### 2. 布局结构破坏性变更

**风险**：引入 Dashboard 布局会改变现有页面的渲染结构，可能影响已有页面（如 `app/page.tsx`）。

**缓解措施**：
- 当前仅有占位页面，无实际业务逻辑，影响可控
- 使用路由组 `(dashboard)` 隔离，未来认证页面可使用其他布局
- 在 `/settings` 页面充分测试布局效果后再应用到其他页面

### 3. next-themes 依赖风险

**风险**：依赖第三方库可能带来版本兼容性问题或安全漏洞。

**缓解措施**：
- `next-themes` 是 shadcn/ui 官方推荐方案，社区成熟度高
- 定期检查依赖更新，及时升级
- 核心逻辑简单，必要时可替换为自定义实现

### 4. CSS 变量浏览器兼容性

**风险**：CSS 变量（`var(--primary)`）在极旧浏览器中不支持。

**缓解措施**：
- MES 系统面向内部用户，通常使用现代浏览器
- Tailwind CSS 已广泛使用 CSS 变量，项目已隐式依赖此特性
- 明确浏览器支持策略：Chrome 90+, Edge 90+, Firefox 88+

### 5. localStorage 限制

**风险**：用户禁用 localStorage 或使用隐私模式时，主题偏好无法持久化。

**缓解措施**：
- 设置合理的默认主题（蓝色浅色），确保未存储时的体验可用
- `next-themes` 内置 localStorage 失败时的降级处理
- 未来可扩展：将主题偏好存入数据库（需登录用户）

## 数据模型设计

本功能不涉及数据库操作，无需 Prisma Schema 变更。主题偏好存储在 localStorage：

```typescript
// localStorage 键值对
{
  "theme": "dark",              // next-themes 管理（"light" | "dark"）
  "color-theme": "green"        // ColorThemeProvider 管理（"blue" | "green" | "purple" | "orange" | "cyan" | "indigo"）
}
```

## 权限点定义

本功能无需权限控制，所有用户均可访问 `/settings` 页面和切换主题。

未来若需要限制主题配置权限（如仅管理员可修改），可定义：
- `settings:theme:write` - 修改主题配置的权限

## API 设计

本功能无 Server Actions，所有逻辑在客户端完成（React Context + localStorage）。

### ColorThemeProvider API

```typescript
// lib/theme/color-theme-provider.tsx
export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'indigo';

interface ColorThemeContextValue {
  color: ColorTheme;
  setColor: (color: ColorTheme) => void;
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useColorTheme(): ColorThemeContextValue;
```

## UI 组件设计

### shadcn/ui 组件使用清单

| 组件 | 用途 | 位置 |
|------|------|------|
| `Button` | Header 中的主题切换按钮、Settings 页面的颜色选择按钮 | Header, ThemeSwitcher |
| `Card` | Settings 页面的配置区域和预览区域 | settings/page.tsx |
| `Select` | Settings 页面组件预览 | settings/page.tsx |
| `Alert` | Settings 页面组件预览 | settings/page.tsx |
| `Label` | Settings 页面表单标签 | ThemeSwitcher |

### 组件层次结构

```
app/(dashboard)/layout.tsx
└── DashboardLayout
    ├── Header
    │   ├── Logo
    │   └── ThemeToggle (明暗快捷切换)
    ├── Sidebar
    │   └── NavItem[]
    └── Main
        └── {children}

app/(dashboard)/settings/page.tsx
└── SettingsPage
    ├── PageHeader
    ├── Card (主题配置)
    │   └── ThemeSwitcher
    │       ├── 明暗模式选择器
    │       └── 主色调选择器（3×2 网格布局）
    └── Card (组件预览)
        ├── Button 预览
        ├── Select 预览
        ├── Alert 预览（3 种：信息、警告、主色）
        └── Card 预览
```

## Migration Plan

本功能为新增功能，无需数据迁移。部署步骤：

1. **安装依赖**：
   ```bash
   npm install next-themes
   npx shadcn-ui@latest add button card select alert label
   ```

2. **更新代码**：按任务清单顺序实施（见 `tasks.md`）

3. **验证**：
   - 访问 `/settings` 页面，测试 6 种颜色 × 2 种模式 = 12 种组合
   - 刷新页面，验证主题持久化
   - 测试 Header 的明暗快捷切换
   - 验证 Sidebar 导航正常工作
   - 验证主色 Alert 在不同主题下显示正确的颜色

4. **Rollback 策略**：
   - Git revert 所有相关 commits
   - 移除 `next-themes` 依赖（`npm uninstall next-themes`）
   - 恢复 `app/layout.tsx` 和 `app/globals.css` 的原始状态

## Open Questions

无待解决问题。需求已明确，技术方案已确定。
