## ADDED Requirements

### Requirement: 系统必须提供 Dashboard 布局

系统必须提供一个标准的 Dashboard 布局结构，包含顶部 Header、左侧 Sidebar 和主内容区域。布局必须固定 Header 和 Sidebar 的位置，主内容区域可滚动。

#### Scenario: 用户访问任意 Dashboard 页面
- **WHEN** 用户访问首页 `/` 或设置页面 `/settings`
- **THEN** 页面显示完整的 Dashboard 布局
- **THEN** 顶部显示 Header（包含 logo 和主题切换按钮）
- **THEN** 左侧显示 Sidebar（包含导航菜单）
- **THEN** 主内容区域显示当前页面内容

#### Scenario: Header 固定在顶部
- **WHEN** 用户在主内容区域向下滚动
- **THEN** Header 保持固定在页面顶部
- **THEN** Sidebar 保持固定在页面左侧
- **THEN** 仅主内容区域滚动

#### Scenario: 窗口尺寸调整时布局自适应
- **WHEN** 用户调整浏览器窗口大小
- **THEN** Header 宽度自适应，始终占满屏幕宽度
- **THEN** Sidebar 宽度保持固定 240px
- **THEN** 主内容区域宽度自适应剩余空间

### Requirement: Header 必须包含 logo 和主题快捷切换按钮

Header 必须在左侧显示系统 logo 和名称，右侧显示明暗主题快捷切换按钮。按钮点击后立即切换明暗模式。

#### Scenario: Header 显示系统标识
- **WHEN** 用户查看 Header
- **THEN** Header 左侧显示"MES 管理系统"文字
- **THEN** 文字使用系统标准字体和颜色

#### Scenario: Header 显示主题切换按钮
- **WHEN** 系统当前为浅色模式
- **THEN** Header 右侧显示主题切换按钮
- **THEN** 按钮显示太阳图标，表示当前为浅色模式

#### Scenario: 点击 Header 切换按钮切换主题
- **WHEN** 用户点击 Header 右侧的主题切换按钮
- **THEN** 系统在明暗模式间切换
- **THEN** 按钮图标相应更新（太阳 ↔ 月亮）

### Requirement: Sidebar 必须提供导航菜单

Sidebar 必须显示系统的主要导航菜单项，每个菜单项包含图标和文字标签。用户点击菜单项后导航到对应页面，当前页面的菜单项必须显示激活状态。

#### Scenario: Sidebar 显示菜单列表
- **WHEN** 用户查看 Sidebar
- **THEN** Sidebar 显示"首页"菜单项（Home 图标 + 文字）
- **THEN** Sidebar 显示"设置"菜单项（Settings 图标 + 文字）

#### Scenario: 点击菜单项导航到对应页面
- **WHEN** 用户在首页点击"设置"菜单项
- **THEN** 系统导航到 `/settings` 页面
- **THEN** 主内容区域显示设置页面内容
- **THEN** "设置"菜单项显示激活状态（高亮背景或边框）

#### Scenario: 当前页面的菜单项显示激活状态
- **WHEN** 用户当前在 `/settings` 页面
- **THEN** "设置"菜单项显示激活状态（背景色或文字颜色变化）
- **THEN** 其他菜单项显示非激活状态

#### Scenario: Sidebar 宽度固定
- **WHEN** 用户查看 Sidebar
- **THEN** Sidebar 宽度固定为 240px
- **THEN** Sidebar 内容垂直排列（图标 + 文字）

### Requirement: 布局必须响应主题切换

Dashboard 布局的所有组件（Header、Sidebar、Main）必须响应主题切换，根据当前主题（明暗模式和主色调）动态更新样式。

#### Scenario: 切换到深色模式后布局样式更新
- **WHEN** 用户切换到深色模式
- **THEN** Header 背景色切换为深色
- **THEN** Sidebar 背景色切换为深色
- **THEN** 主内容区域背景色切换为深色
- **THEN** 所有文字颜色切换为浅色以保持可读性

#### Scenario: 切换主题颜色后强调色更新
- **WHEN** 用户切换到绿色主题
- **THEN** Sidebar 中激活菜单项的高亮色使用绿色
- **THEN** Header 中的主题切换按钮 hover 状态使用绿色
- **THEN** 其他使用 primary 颜色的元素更新为绿色
