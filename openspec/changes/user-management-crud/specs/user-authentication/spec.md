## MODIFIED Requirements

### Requirement: 使用 username 作为登录凭证
系统必须使用 username 字段而非 email 作为用户登录的唯一标识。

#### Scenario: 使用 username 登录成功
- **WHEN** 用户在登录页面输入正确的 username 和 password
- **THEN** 系统验证 username 对应的用户记录，密码匹配且 deletedAt 为 null 时创建会话

#### Scenario: username 不存在
- **WHEN** 用户输入不存在的 username
- **THEN** 系统返回"账号不存在或密码错误"，不暴露具体原因

#### Scenario: 密码错误
- **WHEN** 用户输入正确的 username 但密码错误
- **THEN** 系统返回"账号不存在或密码错误"

#### Scenario: 软删除用户无法登录
- **WHEN** 用户的 deletedAt 字段不为 null
- **THEN** 即使 username 和 password 正确，系统也拒绝登录并返回"账号不存在或密码错误"

#### Scenario: 登录页面显示调整
- **WHEN** 用户访问登录页面
- **THEN** 输入框标签显示"用户名"而非"邮箱"，placeholder 提示"请输入用户名"

## ADDED Requirements

### Requirement: User 数据模型包含 username 字段
User 表必须包含 username 字段作为唯一标识，email 字段改为可选且非唯一。

#### Scenario: username 唯一性约束
- **WHEN** 创建或更新用户时 username 与现有用户重复
- **THEN** 数据库拒绝操作并返回唯一性约束错误

#### Scenario: email 可为空
- **WHEN** 创建用户时不提供 email
- **THEN** 系统允许 email 字段为 null

#### Scenario: email 可重复
- **WHEN** 多个用户使用相同的 email
- **THEN** 系统允许保存（email 无唯一性约束）

#### Scenario: phone 字段新增
- **WHEN** 创建或更新用户
- **THEN** 系统支持可选的 phone 字段，允许为 null，无唯一性约束
