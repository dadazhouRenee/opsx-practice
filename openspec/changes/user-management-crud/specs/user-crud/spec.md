## ADDED Requirements

### Requirement: 用户创建
系统必须允许管理员创建新用户账号，包含 username（必填）、name、email、phone 字段，系统自动为新用户设置初始密码。

#### Scenario: 成功创建用户
- **WHEN** 管理员填写有效的 username（3-20字符，仅字母数字下划线）和可选的 name/email/phone
- **THEN** 系统创建用户记录，密码设置为 admin123456（bcrypt hash），返回创建成功

#### Scenario: username 已存在
- **WHEN** 管理员使用已存在的 username 创建用户
- **THEN** 系统返回错误"用户名已存在"，不创建记录

#### Scenario: username 格式不合法
- **WHEN** 管理员输入少于3个字符或包含特殊字符的 username
- **THEN** 系统返回格式校验错误，不创建记录

#### Scenario: email 格式不合法
- **WHEN** 管理员输入格式错误的 email（如果填写）
- **THEN** 系统返回 email 格式错误，不创建记录

#### Scenario: phone 格式不合法
- **WHEN** 管理员输入不符合中国手机号规则的 phone（如果填写）
- **THEN** 系统返回手机号格式错误，不创建记录

### Requirement: 用户列表查询
系统必须提供分页的用户列表，支持按 username/email/phone 模糊筛选，仅显示未删除的用户。

#### Scenario: 查询第一页用户
- **WHEN** 管理员访问用户列表页面，未输入筛选条件
- **THEN** 系统返回第一页未删除用户（默认每页10条），包含 username/name/email/phone/createdAt 字段和总页数

#### Scenario: 按 username 筛选
- **WHEN** 管理员在搜索框输入 username 的部分内容
- **THEN** 系统返回 username 包含该关键词的用户列表（不区分大小写）

#### Scenario: 按 email 筛选
- **WHEN** 管理员在搜索框输入 email 的部分内容
- **THEN** 系统返回 email 包含该关键词的用户列表

#### Scenario: 按 phone 筛选
- **WHEN** 管理员在搜索框输入 phone 的部分内容
- **THEN** 系统返回 phone 包含该关键词的用户列表

#### Scenario: 多字段模糊匹配
- **WHEN** 管理员输入搜索关键词
- **THEN** 系统在 username/email/phone 三个字段中任一匹配即返回该用户

#### Scenario: 翻页查询
- **WHEN** 管理员点击第 N 页
- **THEN** 系统返回第 N 页的用户数据，保持当前筛选条件

#### Scenario: 软删除用户不显示
- **WHEN** 系统查询用户列表
- **THEN** deletedAt 不为空的用户不出现在列表中

### Requirement: 用户详情查看
系统必须允许管理员查看单个用户的完整信息。

#### Scenario: 查看用户详情
- **WHEN** 管理员点击列表中的"查看"按钮
- **THEN** 系统以只读模式展示该用户的 username/name/email/phone/createdAt/updatedAt 信息

### Requirement: 用户信息编辑
系统必须允许管理员编辑用户的 name/email/phone 字段，username 不可修改。

#### Scenario: 成功更新用户信息
- **WHEN** 管理员修改用户的 name/email/phone 并提交
- **THEN** 系统更新用户记录，updatedAt 自动更新为当前时间，返回更新成功

#### Scenario: username 不可编辑
- **WHEN** 管理员尝试修改 username
- **THEN** 系统界面不提供 username 编辑入口（只读显示）

#### Scenario: 编辑时校验 email 格式
- **WHEN** 管理员输入格式错误的 email
- **THEN** 系统返回校验错误，不更新记录

#### Scenario: 编辑时校验 phone 格式
- **WHEN** 管理员输入格式错误的 phone
- **THEN** 系统返回校验错误，不更新记录

#### Scenario: 清空可选字段
- **WHEN** 管理员将 email 或 phone 清空
- **THEN** 系统允许保存，对应字段设置为 null

### Requirement: 用户软删除
系统必须支持软删除用户，被删除用户保留数据但不在列表显示且无法登录。

#### Scenario: 成功删除用户
- **WHEN** 管理员点击"删除"并确认操作
- **THEN** 系统设置该用户的 deletedAt 为当前时间，用户从列表消失

#### Scenario: 删除前二次确认
- **WHEN** 管理员点击"删除"按钮
- **THEN** 系统弹出确认对话框，显示"确定要删除用户 [username] 吗？"

#### Scenario: 取消删除操作
- **WHEN** 管理员在确认对话框点击"取消"
- **THEN** 系统关闭对话框，不执行删除操作

#### Scenario: 已删除用户不可再次删除
- **WHEN** 用户已被软删除（deletedAt 不为空）
- **THEN** 系统不在列表中显示该用户，无法再次执行删除操作
