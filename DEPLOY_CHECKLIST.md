# ✅ Cloudflare Pages 上传检查清单

## 📋 上传前准备

- [x] ✅ 构建完成 (`npm run build`)
- [x] ✅ 构建产物位于 `dist/` 目录
- [x] ✅ 所有文件完整:
  - `index.html` (802 字节)
  - `favicon.svg` (258 字节)
  - `assets/index-BlOpaFzZ.js` (36 KB)
  - `assets/index-ByMUQCDk.css` (20 KB)
  - `assets/vue-vendor-B4ZIvYVF.js` (71 KB)

---

## 📤 上传步骤

### 第 1 步: 访问 Cloudflare Pages
- [ ] 打开 https://dash.cloudflare.com/
- [ ] 进入 **Workers & Pages**
- [ ] 点击 **Create application**
- [ ] 选择 **Pages** → **Upload assets**

### 第 2 步: 创建项目
- [ ] 输入项目名称: `api-cost` (或自定义名称)
- [ ] 点击 **Create project**

### 第 3 步: 上传文件
需要上传的文件 (从 `F:/api-cost/dist/` 目录):

```
上传清单:
✅ index.html
✅ favicon.svg
✅ assets/index-BlOpaFzZ.js
✅ assets/index-ByMUQCDk.css
✅ assets/vue-vendor-B4ZIvYVF.js
```

**上传方式:**
- 方法 1: 直接拖拽整个 `dist/` 文件夹到上传区域
- 方法 2: 选择 `dist/` 目录中的所有文件上传

⚠️ **注意**: 保持目录结构,`assets/` 文件夹中的文件必须在 `assets/` 子目录下!

### 第 4 步: 部署
- [ ] 确认文件列表正确
- [ ] 点击 **Deploy site**
- [ ] 等待部署完成 (10-30 秒)

### 第 5 步: 获取链接
- [ ] 复制部署链接: `https://your-project.pages.dev`
- [ ] 在浏览器中打开测试

---

## 🧪 部署后测试清单

### 基础功能测试
- [ ] 页面正常加载,无 404 错误
- [ ] CSS 样式正确应用
- [ ] 页面标题显示: "API 查询工具"
- [ ] 顶部标题显示正常

### 智能粘贴识别功能测试
- [ ] 顶部有**蓝紫渐变**的识别区域
- [ ] 粘贴框有闪电图标 ⚡
- [ ] placeholder 提示文字显示正确

**测试用例 1: 标准格式**
```
粘贴内容:
Base URL:https://kiro2api-node.zeabur.app
key:sk-hdushdgsg988hfuhftte6bbst5rwvv
协议:Anthropic
```

预期结果:
- [ ] 自动显示识别结果
- [ ] URL 识别为: `https://kiro2api-node.zeabur.app`
- [ ] Key 识别为: `sk-hdushdg...t5rwvv` (脱敏显示)
- [ ] 显示 "🔑 API Key (1个)"

**测试用例 2: 应用到表单**
- [ ] 点击 "应用到下方表单" 按钮
- [ ] API 地址字段自动填充 URL
- [ ] API Key 字段自动填充密钥
- [ ] 粘贴框自动清空

**测试用例 3: 多个密钥**
```
粘贴内容:
API: https://api.openai.com
key1: sk-aaaaaaaaaaaaaaaaaaaaaaaaaa
key2: sk-bbbbbbbbbbbbbbbbbbbbbbbbbb
```

预期结果:
- [ ] 识别出 2 个密钥
- [ ] 显示 "🔑 API Key (2个)"
- [ ] 应用后两个密钥都出现在 Key 输入框 (每行一个)

### 其他功能测试
- [ ] 平台预设按钮正常工作
- [ ] 历史记录功能正常
- [ ] API 查询按钮可用

---

## 📊 性能检查

打开浏览器开发者工具 (F12):

### Network 面板
- [ ] 所有资源加载成功 (状态码 200)
- [ ] 没有 404 错误
- [ ] 页面加载时间 < 2 秒

### Console 面板
- [ ] 没有 JavaScript 错误
- [ ] 没有警告信息

### Lighthouse 检查 (可选)
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 80

---

## 🎉 部署成功!

如果所有检查项都通过,恭喜你成功部署了带有智能粘贴识别功能的 API 查询工具!

**部署链接:** `___________________________` (填写你的链接)

**下一步:**
1. ✅ 添加自定义域名 (可选)
2. ✅ 分享给团队成员
3. ✅ 收集用户反馈
4. ✅ 根据需要优化功能

---

## 🔧 故障排查

### 问题 1: 页面空白
**解决方案:**
- 检查浏览器控制台是否有错误
- 清除浏览器缓存后重新访问
- 确认所有文件都已上传

### 问题 2: 智能识别功能不显示
**解决方案:**
- 按 Ctrl+Shift+R 强制刷新
- 检查 Network 面板确认 JS 文件加载成功
- 确认 `assets/` 目录结构正确

### 问题 3: 样式错乱
**解决方案:**
- 确认 CSS 文件已加载 (检查 Network 面板)
- 确认没有浏览器扩展干扰样式

### 问题 4: 无法点击按钮
**解决方案:**
- 打开 Console 查看是否有 JS 错误
- 确认 Vue.js 运行时已正确加载

---

## 📞 需要帮助?

遇到问题可以:
1. 查看 [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) 详细部署指南
2. 检查 Cloudflare Pages 官方文档
3. 查看项目 README.md

---

**部署日期:** _______________
**部署人员:** _______________
**项目版本:** v1.0.0 (智能粘贴识别功能)
