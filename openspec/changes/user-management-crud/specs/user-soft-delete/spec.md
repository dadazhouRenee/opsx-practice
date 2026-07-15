## ADDED Requirements

### Requirement: 软删除标记机制
系统必须使用 deletedAt 时间戳字段标记用户删除状态，而非物理删除记录。

#### Scenario: 删除时记录时间戳
- **WHEN** 管理员执行删除用户操作
- **THEN** 系统设置该用户的 deletedAt 字段为当前时间（DateTime），不删除数据库记录

#### Scenario: 未删除用户的标记为空
- **WHEN** 用户未被删除
- **THEN** 该用户的 deletedAt 字段为 null

#### Scenario: 级联关系保留
- **WHEN** 用户被软删除
- **THEN** 该用户的关联数据（Session/Account/UserPermission）保持完整，不被物理删除

### Requirement: 软删除用户在列表中隐藏
系统必须确保软删除用户不出现在用户管理列表中。

#### Scenario: 列表查询过滤已删除用户
- **WHEN** 系统执行用户列表查询
- **THEN** 查询条件必须包含 `deletedAt IS NULL`，已删除用户不返回

#### Scenario: 搜索不匹配已删除用户
- **WHEN** 管理员使用关键词搜索
- **THEN** 即使已删除用户的 username/email/phone 匹配关键词，也不出现在搜索结果中

### Requirement: 软删除用户禁止登录
系统必须在认证阶段拦截软删除用户的登录请求。

#### Scenario: 已删除用户登录被拒绝
- **WHEN** 用户的 deletedAt 不为空，且尝试使用正确的 username 和密码登录
- **THEN** 系统返回认证失败，不创建会话，提示"账号不存在或密码错误"（不暴露账号状态）

#### Scenario: 未删除用户正常登录
- **WHEN** 用户的 deletedAt 为 null，且提供正确凭证
- **THEN** 系统允许登录并创建会话

#### Scenario: 删除前的活跃会话
- **WHEN** 用户被删除时已有活跃的登录会话
- **THEN** 现有会话不主动失效（MVP 阶段接受此限制），但用户退出后无法再次登录
