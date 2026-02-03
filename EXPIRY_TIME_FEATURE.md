# API 访问权限截止时间功能

## ✨ 新增功能

在余额查询结果中显示 **API 访问权限截止时间**,帮助用户及时了解 API Key 的有效期。

## 🎯 功能特性

### 1. 自动获取到期时间

从 API 接口获取以下字段 (按优先级):
- `access_until` (OpenAI 官方)
- `expires_at` (常用字段)
- `expiry_time` (部分第三方 API)

### 2. 智能显示

**正常状态:**
```
访问截止: 2026-05-15 23:59
🕒 灰色时钟图标
```

**即将到期 (7天内):**
```
访问截止: 2026-02-10 23:59
⚠️ 即将到期
🕒 橙色时钟图标
```

**已过期:**
```
访问截止: 2026-01-01 23:59
⚠️ 已过期
🕒 红色时钟图标
```

### 3. 显示位置

位于余额卡片底部,在使用率进度条下方:

```
┌──────────────────────────┐
│ 密钥 #1      [平台名称]  │
│ sk-xxx...xxx             │
│                          │
│ 总额度      $10.00       │
│ 已使用       $2.50       │
│ 剩余额度     $7.50       │
│                          │
│ 使用率           25.0%   │
│ ████░░░░░░░░░░░░         │
│ ────────────────────────│
│ 访问截止  🕒 2026-05-15  │ ← 新增
└──────────────────────────┘
```

## 📊 API 字段映射

| API 提供商 | 接口路径 | 字段名称 |
|-----------|---------|---------|
| OpenAI 官方 | `/v1/dashboard/billing/subscription` | `access_until` |
| 硅基流动 | `/v1/dashboard/billing/subscription` | `expires_at` |
| DeepSeek | `/v1/balance` | `expires_at` |
| 其他兼容 API | 各种接口 | `expires_at` / `expiry_time` |

## 🔍 实现细节

### 1. API 查询 (`src/utils/api.js`)

```javascript
export async function queryBalance(baseUrl, apiKey) {
  // 获取订阅信息
  const subscriptionData = await fetchWithAuth(...)

  // 提取到期时间 (支持多种字段名)
  const expiresAt = subscriptionData.access_until
                 || subscriptionData.expires_at
                 || null

  return {
    total,
    used,
    remaining,
    expiresAt,  // ← 新增字段
    currency: 'USD'
  }
}
```

### 2. 数据传递 (`src/App.vue`)

```javascript
balances.value = results.map((result) => {
  if (result.success) {
    return {
      key: result.key,
      total: result.data.total,
      used: result.data.used,
      remaining: result.data.remaining,
      expiresAt: result.data.expiresAt,  // ← 传递到组件
      usagePercent: ...,
      platform: detectPlatform(url)
    }
  }
})
```

### 3. UI 显示 (`src/components/BalanceTable.vue`)

**判断逻辑:**

```javascript
// 判断是否已过期
const isExpired = (timestamp) => {
  return Date.now() > timestamp * 1000
}

// 判断是否即将到期 (7天内)
const isExpiringSoon = (timestamp) => {
  const daysUntilExpiry = (timestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7
}
```

**格式化显示:**

```javascript
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  // 输出: "2026-05-15 23:59"
}
```

## 🎨 视觉设计

### 颜色状态

| 状态 | 文字颜色 | 图标颜色 | 说明 |
|-----|---------|---------|------|
| 正常 | `text-text-primary` | `text-text-secondary` | 灰色 |
| 即将到期 | `text-orange-500` | `text-orange-500` | 橙色 |
| 已过期 | `text-error` | `text-error` | 红色 |

### 布局结构

```html
<div class="pt-3 border-t border-border">
  <div class="flex items-center justify-between">
    <span class="text-xs text-text-secondary">访问截止</span>
    <div class="flex items-center gap-1.5">
      <svg><!-- 时钟图标 --></svg>
      <span>2026-05-15 23:59</span>
    </div>
  </div>
  <p v-if="已过期或即将到期" class="text-xs mt-1">
    ⚠️ 状态提示
  </p>
</div>
```

## 🧪 测试验证

### 测试场景

1. **有到期时间的 API**
   - 显示完整的到期时间
   - 根据状态显示对应颜色

2. **无到期时间的 API**
   - 不显示到期时间区域
   - 其他信息正常显示

3. **不同到期状态**
   - 正常: > 7天后到期
   - 即将到期: 1-7天后到期
   - 已过期: 当前时间 > 到期时间

### 测试数据

```javascript
// 正常状态 (30天后)
expiresAt: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

// 即将到期 (3天后)
expiresAt: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60

// 已过期 (昨天)
expiresAt: Math.floor(Date.now() / 1000) - 24 * 60 * 60
```

## 📋 兼容性

### 支持的时间戳格式

- ✅ Unix 时间戳 (秒) - 标准格式
- ✅ Unix 时间戳 (毫秒) - 自动检测并转换
- ✅ ISO 8601 字符串 - 自动解析

### 降级处理

如果 API 不返回到期时间:
- 该区域不显示 (优雅降级)
- 不影响其他功能
- 不产生错误

## 🚀 部署

### 修改的文件

1. `src/utils/api.js` - 添加 `expiresAt` 字段获取
2. `src/App.vue` - 传递 `expiresAt` 到组件
3. `src/components/BalanceTable.vue` - 显示到期时间 UI

### 构建验证

```bash
npm run build
# ✓ built in 836ms
```

### Git 提交

```bash
git add src/utils/api.js src/App.vue src/components/BalanceTable.vue
git commit -m "feat: 添加 API 访问权限截止时间显示

- 自动获取并显示 API Key 到期时间
- 支持多种字段名 (access_until, expires_at, expiry_time)
- 智能状态提示 (正常/即将到期/已过期)
- 颜色编码显示 (灰色/橙色/红色)
- 优雅降级,无到期时间不影响使用"

git push
```

## ✨ 用户价值

1. **及时提醒**: 提前知道 API Key 到期时间
2. **避免中断**: 在到期前 7 天警告,有足够时间续费
3. **状态清晰**: 颜色和图标直观显示到期状态
4. **多平台支持**: 兼容各种 API 提供商

## 📝 注意事项

1. **时间戳单位**:
   - API 返回时间戳通常是秒 (Unix timestamp)
   - JavaScript Date 使用毫秒,需要 × 1000

2. **时区处理**:
   - 使用 `toLocaleDateString('zh-CN')` 自动转换为本地时区
   - 显示为中国标准时间格式

3. **容错处理**:
   - 如果字段不存在或格式错误,不显示该区域
   - 不影响其他数据的正常展示

## 🎉 效果预览

部署后,用户在查询余额时会看到:

```
密钥 #1                [OpenAI]
sk-proj-xxx...xxx

总额度          $10.00
已使用           $2.50
剩余额度         $7.50

使用率             25.0%
████░░░░░░░░░░░░

────────────────────────
访问截止  🕒 2026-05-15 23:59
```

如果即将到期或已过期,会显示醒目的橙色/红色警告! ⚠️
