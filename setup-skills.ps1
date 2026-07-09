# 设置 AI 工具配置符号链接
# 运行方式: .\setup-skills.ps1

Write-Host "设置 AI 工具配置符号链接..." -ForegroundColor Green

# 检查 .agents/skills 是否存在
if (!(Test-Path ".agents\skills")) {
    Write-Host "错误: .agents\skills 目录不存在" -ForegroundColor Red
    exit 1
}

# 1. 创建 AGENTS.md 符号链接
if (Test-Path "AGENTS.md") {
    $item = Get-Item "AGENTS.md"
    if ($item.LinkType -eq "SymbolicLink") {
        Write-Host "AGENTS.md 符号链接已存在，跳过" -ForegroundColor Yellow
    } else {
        Write-Host "警告: AGENTS.md 已存在但不是符号链接，请手动处理" -ForegroundColor Yellow
    }
} else {
    # 使用相对路径创建符号链接
    cmd /c "mklink AGENTS.md CLAUDE.md" | Out-Null
    Write-Host "✓ 创建 AGENTS.md -> CLAUDE.md (相对路径)" -ForegroundColor Green
}

# 2. 创建 .claude/skills 符号链接
if (Test-Path ".claude\skills") {
    $item = Get-Item ".claude\skills"
    if ($item.LinkType -eq "SymbolicLink") {
        Write-Host ".claude\skills 符号链接已存在，跳过" -ForegroundColor Yellow
    } else {
        Write-Host "警告: .claude\skills 已存在但不是符号链接，请手动处理" -ForegroundColor Yellow
    }
} else {
    # 使用相对路径创建目录符号链接
    cmd /c "cd .claude && mklink /D skills ..\\.agents\\skills" | Out-Null
    Write-Host "✓ 创建 .claude\skills -> ..\.agents\skills (相对路径)" -ForegroundColor Green
}

# 3. 创建 .codex/skills 符号链接
if (Test-Path ".codex\skills") {
    $item = Get-Item ".codex\skills"
    if ($item.LinkType -eq "SymbolicLink") {
        Write-Host ".codex\skills 符号链接已存在，跳过" -ForegroundColor Yellow
    } else {
        Write-Host "警告: .codex\skills 已存在但不是符号链接，请手动处理" -ForegroundColor Yellow
    }
} else {
    # 使用相对路径创建目录符号链接
    cmd /c "cd .codex && mklink /D skills ..\\.agents\\skills" | Out-Null
    Write-Host "✓ 创建 .codex\skills -> ..\.agents\skills (相对路径)" -ForegroundColor Green
}
Write-Host "`n注意: 创建符号链接需要管理员权限或开发者模式" -ForegroundColor Yellow
Write-Host "`n设置完成！" -ForegroundColor Green
Write-Host "- AGENTS.md 和 CLAUDE.md 指向同一份项目规范(符号链接)" -ForegroundColor Cyan
Write-Host "- .claude/skills 和 .codex/skills 都使用符号链接指向 .agents\skills" -ForegroundColor Cyan
Write-Host "`n最终请确认:" -ForegroundColor Cyan
Get-Item "AGENTS.md",".claude\skills", ".codex\skills" | Format-Table Name, LinkType, Target

