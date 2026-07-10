## Why

用户需要自定义系统外观以提升使用体验。明暗主题切换是核心需求，可适应不同光线环境；主色调选择器作为次要功能，提供个性化定制。当前系统缺少这些能力，所有用户只能使用默认浅色主题。现在是 MVP 阶段搭建 UI 基础设施的最佳时机，主题系统将成为所有后续 UI 组件的基础。

## What Changes

- **新增明暗主题切换功能**：用户可在浅色和深色模式间切换
- **新增主色调选择器**：提供 4 种主题颜色（蓝、绿、紫、橙）
- **新增 Dashboard 布局系统**：
  - 顶部 Header（logo + 明暗快捷切换）
  - 左侧 Sidebar（导航菜单）
  - 主内容区域
- **新增 `/settings` 页面**：完整主题配置界面 + 组件预览区
- **localStorage 持久化**：用户主题偏好跨会话保存
- **安装并配置 shadcn/ui 组件**：button, card, select, alert, label 等基础组件

## Capabilities

### New Capabilities

- `theme-switching`: 明暗主题切换和主色调选择，包括 ThemeProvider、localStorage 持久化、CSS 变量管理
- `dashboard-layout`: Dashboard 布局系统，包括 Header、Sidebar、主内容区的布局组件
- `settings-page`: 主题设置页面，包含主题配置器和组件预览区

### Modified Capabilities

<!-- 无现有能力需要修改 -->

## Impact

**新增文件**：
- `lib/theme/` - 主题管理模块（types, constants, providers, hooks）
- `components/layout/` - 布局组件（dashboard-layout, header, sidebar）
- `components/ui/` - shadcn/ui 组件（当前为空，将安装基础组件）
- `app/(dashboard)/` - Dashboard 路由组
- `app/(dashboard)/settings/page.tsx` - 设置页面

**修改文件**：
- `app/globals.css` - 新增 4 个主色调 CSS 变量类
- `app/layout.tsx` - 包裹 ThemeProvider

**依赖变更**：
- 新增：`next-themes` (处理明暗切换的成熟方案)
- 安装：shadcn/ui 组件（button, card, select, alert, label）

**影响范围**：
- 全局布局结构改变（所有页面将使用 Dashboard 布局）
- 所有未来 UI 组件将基于此主题系统开发
- 为后续功能（用户管理、工单管理等）奠定 UI 基础
