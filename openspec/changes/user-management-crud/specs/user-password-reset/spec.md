## ADDED Requirements

### Requirement: 管理员重置用户密码
系统必须允许管理员将指定用户的密码重置为系统固定初始密码 admin123456。

#### Scenario: 成功重置密码
- **WHEN** 管理员在用户列表点击"重置密码"并确认操作
- **THEN** 系统将该用户的 password 字段更新为 admin123456 的 bcrypt hash，返回成功提示

#### Scenario: 重置前二次确认
- **WHEN** 管理员点击"重置密码"按钮
- **THEN** 系统弹出确认对话框，显示"确定要重置用户 [username] 的密码吗？密码将重置为 admin123456"

#### Scenario: 取消重置操作
- **WHEN** 管理员在确认对话框点击"取消"
- **THEN** 系统关闭对话框，不执行重置操作

#### Scenario: 重置已删除用户的密码
- **WHEN** 用户已被软删除（deletedAt 不为空）
- **THEN** 系统不在列表中显示该用户，无法执行重置密码操作

#### Scenario: 密码立即生效
- **WHEN** 密码重置成功
- **THEN** 用户下次登录必须使用新密码 admin123456，旧密码立即失效
