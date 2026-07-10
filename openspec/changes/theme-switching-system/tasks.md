## 1. 依赖安装

- [ ] 1.1 安装 next-themes 库：`npm install next-themes`
- [ ] 1.2 安装 shadcn/ui 基础组件：`npx shadcn-ui@latest add button card select alert label`

## 2. 主题基础设施

- [ ] 2.1 创建主题类型定义文件 `lib/theme/types.ts`，定义 `ColorTheme` 类型（'blue' | 'green' | 'purple' | 'orange'）
- [ ] 2.2 创建主题常量文件 `lib/theme/constants.ts`，定义 4 种颜色的配置（名称、HSL 值）和默认主题（蓝色）
- [ ] 2.3 创建 ColorThemeProvider 组件 `lib/theme/color-theme-provider.tsx`，管理主色调状态和 localStorage 同步
- [ ] 2.4 创建 useColorTheme Hook `lib/theme/use-theme.ts`，提供 `{ color, setColor }` API
- [ ] 2.5 创建 barrel export `lib/theme/index.ts`，统一导出所有主题相关模块

## 3. CSS 变量配置

- [ ] 3.1 更新 `app/globals.css`，在现有 `.dark` 规则后添加 4 个主色调 CSS 变量类：`[data-theme="blue"]`、`[data-theme="green"]`、`[data-theme="purple"]`、`[data-theme="orange"]`，每个定义 `--primary` 和 `--primary-foreground`

## 4. 根布局集成

- [ ] 4.1 更新 `app/layout.tsx`，引入 `next-themes` 的 ThemeProvider（attribute="class", defaultTheme="light", disableTransitionOnChange）
- [ ] 4.2 在 `app/layout.tsx` 中嵌套包裹 ColorThemeProvider，形成双层 Provider 结构
- [ ] 4.3 在 `<html>` 标签添加 `suppressHydrationWarning` 属性

## 5. Dashboard 布局组件

- [ ] 5.1 创建 Header 组件 `components/layout/header.tsx`，包含左侧 logo 文字"MES 管理系统"和右侧 ThemeToggle 按钮
- [ ] 5.2 创建 ThemeToggle 组件 `components/layout/theme-toggle.tsx`，使用 `useTheme` from next-themes，显示 Sun/Moon 图标（lucide-react），点击切换明暗模式
- [ ] 5.3 创建 Sidebar 组件 `components/layout/sidebar.tsx`，固定宽度 240px，硬编码菜单项（首页、设置），使用 `usePathname` 高亮当前路由
- [ ] 5.4 创建 DashboardLayout 组件 `components/layout/dashboard-layout.tsx`，组合 Header（顶部固定）、Sidebar（左侧固定）、Main（可滚动）

## 6. Dashboard 路由组

- [ ] 6.1 创建路由组目录 `app/(dashboard)/` 和布局文件 `app/(dashboard)/layout.tsx`，使用 DashboardLayout 包裹 children
- [ ] 6.2 移动 `app/page.tsx` 到 `app/(dashboard)/page.tsx`，保持原有内容不变（首页占位内容）

## 7. 主题切换器组件

- [ ] 7.1 创建 ThemeSwitcher 组件 `components/theme-switcher.tsx`，包含明暗模式选择器（两个按钮：浅色/深色，带图标）
- [ ] 7.2 在 ThemeSwitcher 中添加主色调选择器，2x2 网格布局显示 4 个颜色按钮，每个按钮背景色为对应主题色，显示中文名称，选中态显示边框高亮

## 8. 设置页面

- [ ] 8.1 创建设置页面 `app/(dashboard)/settings/page.tsx`，包含页面标题"主题设置"和描述
- [ ] 8.2 在设置页面添加"主题配置"Card，内部使用 ThemeSwitcher 组件
- [ ] 8.3 在设置页面添加"组件预览"Card，展示按钮样式（5 种变体：default, secondary, outline, destructive, ghost）
- [ ] 8.4 在组件预览 Card 中添加 Select 组件示例（占位符"选择一个选项"，包含 3 个选项）
- [ ] 8.5 在组件预览 Card 中添加 Alert 组件示例（信息类型和警告类型各一个）
- [ ] 8.6 在组件预览 Card 中添加嵌套 Card 示例（标题、描述、内容文本）

## 9. 验证与测试

- [ ] 9.1 启动开发服务器，访问 `/settings` 页面，测试明暗模式切换（Header 和设置页面两处）
- [ ] 9.2 测试 4 种主题颜色切换，验证所有 primary 颜色的组件（按钮、Select focus、选中边框）实时更新
- [ ] 9.3 测试主题持久化：切换主题后刷新页面，验证主题偏好恢复
- [ ] 9.4 测试 Sidebar 导航：点击"首页"和"设置"菜单项，验证路由跳转和激活状态高亮
- [ ] 9.5 测试所有 8 种主题组合（4 色 × 2 模式），确保无视觉错误或样式异常
