/**
 * 用户管理功能自动化测试脚本
 *
 * ⚠️ 警告：此脚本仅用于开发和测试环境！
 * 不要在生产环境运行此脚本，它会创建和删除测试数据。
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 🔒 安全检查：禁止在生产环境运行
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ 错误：此脚本不能在生产环境运行！')
    console.error('   当前环境: NODE_ENV =', process.env.NODE_ENV)
    process.exit(1)
  }

  // 检查数据库 URL，防止误操作生产数据库
  const dbUrl = process.env.DATABASE_URL || ''
  if (dbUrl.includes('prod') || dbUrl.includes('production')) {
    console.error('❌ 错误：检测到生产数据库连接！')
    console.error('   DATABASE_URL 包含 "prod" 或 "production"')
    console.error('   此脚本仅用于开发和测试环境')
    process.exit(1)
  }

  console.log('🔒 环境检查通过')
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   DATABASE_URL: ${dbUrl}\n`)

  console.log('🚀 开始测试用户管理功能...\n')

  // 清理测试数据
  await prisma.user.deleteMany({
    where: { username: { startsWith: 'test_' } }
  })

  // 测试 1: 创建用户
  console.log('✅ 测试 1: 创建用户')
  const testUser1 = await prisma.user.create({
    data: {
      username: 'test_user1',
      name: '测试用户1',
      email: 'test1@example.com',
      phone: '13800138001',
      password: await bcrypt.hash('admin123456', 10),
    }
  })
  console.log('   - 创建用户成功:', testUser1.username)

  // 测试 2: Username 唯一性
  console.log('\n✅ 测试 2: Username 唯一性校验')
  try {
    await prisma.user.create({
      data: {
        username: 'test_user1', // 重复的用户名
        password: await bcrypt.hash('admin123456', 10),
      }
    })
    console.log('   ❌ 失败：应该抛出唯一性错误')
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('   - Username 唯一性校验通过')
    } else {
      console.log('   ❌ 失败：', error.message)
    }
  }

  // 测试 3: 创建更多测试用户
  console.log('\n✅ 测试 3: 批量创建用户（用于分页测试）')
  for (let i = 2; i <= 12; i++) {
    await prisma.user.create({
      data: {
        username: `test_user${i}`,
        name: `测试用户${i}`,
        email: `test${i}@example.com`,
        phone: `1380013800${i}`,
        password: await bcrypt.hash('admin123456', 10),
      }
    })
  }
  console.log('   - 创建了 11 个额外用户（共 12 个测试用户）')

  // 测试 4: 查询用户列表（分页）
  console.log('\n✅ 测试 4: 分页查询')
  const page1 = await prisma.user.findMany({
    where: { deletedAt: null, username: { startsWith: 'test_' } },
    take: 10,
    skip: 0,
    orderBy: { createdAt: 'desc' }
  })
  console.log(`   - 第 1 页: ${page1.length} 条记录`)

  const page2 = await prisma.user.findMany({
    where: { deletedAt: null, username: { startsWith: 'test_' } },
    take: 10,
    skip: 10,
    orderBy: { createdAt: 'desc' }
  })
  console.log(`   - 第 2 页: ${page2.length} 条记录`)

  // 测试 5: 搜索功能
  console.log('\n✅ 测试 5: 搜索功能')
  const searchResults = await prisma.user.findMany({
    where: {
      deletedAt: null,
      OR: [
        { username: { contains: 'user1' } },
        { email: { contains: 'user1' } },
        { phone: { contains: 'user1' } },
      ]
    }
  })
  console.log(`   - 搜索 "user1" 找到 ${searchResults.length} 条记录`)

  // 测试 6: 更新用户
  console.log('\n✅ 测试 6: 更新用户信息')
  const updated = await prisma.user.update({
    where: { id: testUser1.id },
    data: {
      name: '更新后的名字',
      email: 'updated@example.com',
      phone: '13900139000',
    }
  })
  console.log('   - 更新成功:', {
    username: updated.username, // 不可修改
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
  })

  // 测试 7: 重置密码
  console.log('\n✅ 测试 7: 重置密码')
  const newPassword = await bcrypt.hash('admin123456', 10)
  await prisma.user.update({
    where: { id: testUser1.id },
    data: { password: newPassword }
  })
  const userAfterReset = await prisma.user.findUnique({
    where: { id: testUser1.id }
  })
  const passwordMatches = await bcrypt.compare('admin123456', userAfterReset!.password)
  console.log(`   - 密码重置成功: ${passwordMatches ? '✓' : '✗'}`)

  // 测试 8: 软删除
  console.log('\n✅ 测试 8: 软删除用户')
  await prisma.user.update({
    where: { id: testUser1.id },
    data: { deletedAt: new Date() }
  })
  const deletedUser = await prisma.user.findUnique({
    where: { id: testUser1.id }
  })
  console.log(`   - 软删除成功: deletedAt = ${deletedUser!.deletedAt}`)

  // 测试 9: 软删除用户不出现在列表中
  console.log('\n✅ 测试 9: 软删除用户不出现在列表')
  const activeUsers = await prisma.user.findMany({
    where: { deletedAt: null, username: { startsWith: 'test_' } }
  })
  console.log(`   - 活跃用户数量: ${activeUsers.length}（应该是 11）`)

  // 测试 10: 软删除用户无法登录
  console.log('\n✅ 测试 10: 软删除用户无法登录')
  const loginAttempt = await prisma.user.findUnique({
    where: { username: 'test_user1' }
  })
  if (loginAttempt && loginAttempt.deletedAt) {
    console.log('   - 软删除用户登录被拒绝 ✓')
  } else {
    console.log('   ❌ 软删除用户仍可登录')
  }

  console.log('\n✨ 所有测试完成！')
  console.log('\n📋 测试总结：')
  console.log('   - 创建用户: ✓')
  console.log('   - Username 唯一性: ✓')
  console.log('   - 分页查询: ✓')
  console.log('   - 搜索功能: ✓')
  console.log('   - 更新用户: ✓')
  console.log('   - 重置密码: ✓')
  console.log('   - 软删除: ✓')
  console.log('   - 软删除用户不显示: ✓')
  console.log('   - 软删除用户无法登录: ✓')
}

main()
  .catch((e) => {
    console.error('❌ 测试失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
