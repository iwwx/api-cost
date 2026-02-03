# Cloudflare KV 云端同步功能部署指南

## 📋 功能概述

基于 Cloudflare Workers KV 的自动云端同步功能已集成完成,支持:

- ✅ 自定义平台预设同步
- ✅ API URL 历史记录同步
- ✅ API Key 历史记录同步
- ✅ 自动设备识别
- ✅ 自定义同步码跨设备共享

## 🚀 部署步骤

### 1. 创建 KV Namespace

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **KV**
3. 点击 **Create a namespace**
4. 名称输入: `api-cost-user-data`
5. 创建完成后复制 **Namespace ID**

### 2. 绑定 KV 到 Pages 项目

#### 方式一: 通过 Dashboard (推荐)

1. 进入你的 Pages 项目 (api-cost)
2. 点击 **Settings** → **Functions**
3. 找到 **KV namespace bindings**
4. 点击 **Add binding**
5. 填写:
   - **Variable name**: `USER_DATA`
   - **KV namespace**: 选择刚创建的 `api-cost-user-data`
6. 点击 **Save**

#### 方式二: 通过 wrangler.toml (可选)

编辑 `wrangler.toml` 文件,替换 `your_kv_namespace_id`:

```toml
[[kv_namespaces]]
binding = "USER_DATA"
id = "your_actual_kv_namespace_id"  # 替换为实际的 ID
preview_id = "your_preview_kv_namespace_id"  # 可选: 用于预览环境
```

### 3. 部署代码

```bash
# 提交所有更改
git add .
git commit -m "feat: 添加 Cloudflare KV 云端同步功能"
git push

# Cloudflare Pages 会自动检测 functions/ 目录并部署
```

### 4. 验证部署

1. 等待 Pages 部署完成 (约 1-2 分钟)
2. 访问你的站点
3. 打开浏览器开发者工具 (F12)
4. 切换到 **Console** 标签
5. 修改一个预设,观察日志:
   ```
   [CloudSync] Upload successful
   ```
6. 刷新页面,数据应该保持不变

## 🧪 功能测试

### 测试 1: 自动同步

1. 打开应用
2. 添加一个自定义平台预设
3. 观察页面右上角同步状态:
   - 应显示 "同步中..." (转圈)
   - 1-2秒后显示 "已同步" (绿色勾)
4. 打开开发者工具 → Network
5. 确认有 POST 请求到 `/api/sync`
6. 响应应该是 `{"success": true, "timestamp": ...}`

### 测试 2: 跨设备同步

#### 设备 A:
1. 添加自定义预设 "测试平台"
2. 等待同步完成

#### 设备 B:
1. 打开同一个应用 URL
2. 等待 30 秒 (自动同步间隔)
3. 刷新页面
4. 应该看到 "测试平台" 预设

### 测试 3: 同步码共享 (可选功能)

#### 设备 A:
1. 打开设置 (如果有 UI)
2. 设置同步码: `my-sync-code-2024`
3. 添加预设

#### 设备 B:
1. 打开开发者工具 → Console
2. 执行:
   ```javascript
   localStorage.setItem('_device_id', 'my-sync-code-2024')
   location.reload()
   ```
3. 应该看到设备 A 的数据

### 测试 4: 离线降级

1. 打开开发者工具 → Network
2. 勾选 "Offline" 选项
3. 修改预设
4. 确认不报错
5. 取消 "Offline"
6. 等待几秒,应该自动同步到云端

## 🔧 高级配置

### 调整同步间隔

编辑 `src/composables/useCloudSync.js`:

```javascript
export function useCloudSync(key, defaultValue, options = {}) {
  const {
    autoSync = true,
    syncInterval = 60000,   // 改为 60 秒
    // ...
  } = options
}
```

### 禁用云端同步

用户可以在浏览器 Console 执行:

```javascript
localStorage.setItem('_cloud_sync_enabled', 'false')
location.reload()
```

### 查看设备 ID

在 Console 执行:

```javascript
localStorage.getItem('_device_id')
```

### 清除云端数据

在 Console 执行:

```javascript
import { clearCloudData } from './utils/cloudApi'
await clearCloudData()
```

## 📊 KV 数据结构

存储在 KV 中的数据格式:

**Key**: `user:{deviceId}`

**Value**:
```json
{
  "platform-presets": {
    "custom": [...],
    "builtInOverrides": {...}
  },
  "api-urls": ["https://api.example.com", ...],
  "api-keys": ["sk-xxx", ...],
  "_meta": {
    "lastSync": 1704067200000,
    "deviceId": "abc123..."
  }
}
```

## 🔍 故障排查

### 问题 1: 同步失败,显示 "Invalid device ID"

**原因**: 设备 ID 生成失败或太短

**解决**:
```javascript
// Console 执行
localStorage.removeItem('_device_id')
location.reload()
```

### 问题 2: 同步状态一直显示 "同步中..."

**原因**: API 端点无响应或 KV 未绑定

**检查**:
1. Cloudflare Pages → Settings → Functions → KV bindings
2. 确认 `USER_DATA` 绑定存在
3. 查看 Functions 日志

### 问题 3: 数据没有在设备间同步

**原因**: 使用了不同的设备 ID

**解决**:
- 使用自定义同步码功能
- 在两台设备上设置相同的同步码

### 问题 4: KV 配额超限

**检查**: Cloudflare Dashboard → Workers & Pages → KV → Usage

**免费额度**:
- 100,000 读取/天
- 1,000 写入/天

**优化**:
- 增加同步间隔 (默认 30 秒)
- 减少不必要的数据变更

## 📝 API 端点文档

### POST /api/sync

上传数据到云端

**Headers**:
- `Content-Type: application/json`
- `X-Device-ID: <your-device-id>`

**Body**:
```json
{
  "platform-presets": {...},
  "api-urls": [...],
  "api-keys": [...]
}
```

**Response**:
```json
{
  "success": true,
  "timestamp": 1704067200000
}
```

### GET /api/sync

从云端下载数据

**Headers**:
- `X-Device-ID: <your-device-id>`

**Response**:
```json
{
  "platform-presets": {...},
  "api-urls": [...],
  "api-keys": [...],
  "_meta": {
    "lastSync": 1704067200000,
    "deviceId": "abc123"
  }
}
```

### DELETE /api/sync

清除云端数据

**Headers**:
- `X-Device-ID: <your-device-id>`

**Response**:
```json
{
  "success": true
}
```

## 🎉 完成确认

- [ ] KV Namespace 已创建
- [ ] KV 已绑定到 Pages 项目
- [ ] 代码已推送到 Git
- [ ] Pages 部署成功
- [ ] 测试 1: 自动同步 ✅
- [ ] 测试 2: 跨设备同步 ✅
- [ ] 测试 3: 同步码共享 ✅
- [ ] 测试 4: 离线降级 ✅

## 📞 支持

如有问题,请查看:
- Cloudflare Workers KV 文档: https://developers.cloudflare.com/kv/
- Cloudflare Pages Functions 文档: https://developers.cloudflare.com/pages/functions/

---

**预计效果**: 用户无感知的自动云端同步,数据永不丢失! 🚀
