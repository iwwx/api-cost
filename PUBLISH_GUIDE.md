# 🚀 GitHub 发布和 Cloudflare 部署指南

## 📦 第一步: 发布到 GitHub

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息:
   - **Repository name**: `api-cost-query` (或您喜欢的名称)
   - **Description**: `OpenAI API 余额查询和模型列表工具 - 支持多密钥批量查询`
   - **Public** 或 **Private** (选择公开或私有)
   - ⚠️ **不要**勾选 "Add a README file" (我们已经有了)
   - ⚠️ **不要**勾选 "Add .gitignore" (我们已经有了)

3. 点击 **Create repository**

### 2. 推送代码到 GitHub

在您的终端执行以下命令:

```bash
cd F:/cost

# 添加远程仓库 (替换 YOUR_USERNAME 为您的 GitHub 用户名)
git remote add origin https://github.com/YOUR_USERNAME/api-cost-query.git

# 推送代码
git branch -M main
git push -u origin main
```

**示例**:
```bash
# 如果您的用户名是 zhangsan
git remote add origin https://github.com/zhangsan/api-cost-query.git
git branch -M main
git push -u origin main
```

---

## ☁️ 第二步: 部署到 Cloudflare Pages

### 1. 登录 Cloudflare

1. 访问 https://dash.cloudflare.com/
2. 登录您的 Cloudflare 账号
3. 进入 **Workers & Pages**

### 2. 创建 Pages 项目

1. 点击 **Create application**
2. 选择 **Pages** 选项卡
3. 点击 **Connect to Git**

### 3. 连接 GitHub 仓库

1. 选择 **GitHub** (首次使用需要授权)
2. 选择您刚才创建的仓库: `api-cost-query`
3. 点击 **Begin setup**

### 4. 配置构建设置

填写以下配置:

**Project name**: `api-cost-query` (或自定义)

**Production branch**: `main`

**Build settings**:
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

**Environment variables**: (无需配置,留空)

### 5. 部署

1. 点击 **Save and Deploy**
2. 等待构建完成 (约 1-2 分钟)
3. 部署成功后会得到一个 URL: `https://api-cost-query.pages.dev`

---

## 🌐 第三步: 配置自定义域名 (可选)

### 1. 添加自定义域名

1. 在 Cloudflare Pages 项目页面
2. 进入 **Custom domains**
3. 点击 **Set up a custom domain**
4. 输入您的域名 (例如: `api.example.com`)
5. 按照提示配置 DNS 记录

### 2. DNS 配置

Cloudflare 会自动提示您需要添加的 CNAME 记录:

```
类型: CNAME
名称: api (或 @ 用于根域名)
目标: api-cost-query.pages.dev
```

---

## 🔄 第四步: 后续更新部署

每次代码更新后:

```bash
cd F:/cost

# 1. 提交更改
git add .
git commit -m "描述您的更改"

# 2. 推送到 GitHub
git push

# 3. Cloudflare Pages 会自动检测并重新部署
```

**自动化部署**:
- GitHub 推送后,Cloudflare Pages 会自动触发构建
- 无需手动操作,约 1-2 分钟完成部署
- 可在 Cloudflare Dashboard 查看部署状态

---

## ✅ 验证部署

### 检查清单

- [ ] GitHub 仓库创建成功
- [ ] 代码推送到 GitHub
- [ ] Cloudflare Pages 项目创建成功
- [ ] 构建成功 (无错误)
- [ ] 网站可以访问
- [ ] 功能正常工作 (API 查询、预设管理等)

### 测试步骤

1. 访问您的 Cloudflare Pages URL
2. 测试 API 查询功能
3. 测试平台预设管理 (新增/编辑/删除)
4. 测试数据持久化 (刷新页面后数据保留)
5. 测试响应式布局 (移动端/桌面端)

---

## 🐛 常见问题

### 问题 1: Git 推送失败

**错误**: `Permission denied (publickey)`

**解决**:
```bash
# 使用 HTTPS 而不是 SSH
git remote set-url origin https://github.com/YOUR_USERNAME/api-cost-query.git
git push
```

### 问题 2: Cloudflare 构建失败

**错误**: `Build command failed`

**检查**:
- 确认 `package.json` 中有 `build` 脚本
- 确认构建命令是 `npm run build`
- 查看构建日志中的具体错误

**解决**:
```bash
# 本地测试构建
npm install
npm run build

# 如果本地构建成功,重新推送
git push
```

### 问题 3: 部署成功但页面空白

**检查**:
- 打开浏览器开发工具 (F12)
- 查看 Console 中的错误信息
- 确认资源路径正确

**解决**:
- 检查 `vite.config.js` 中的 `base` 配置
- 确保使用相对路径

---

## 📊 项目信息

### 当前状态
- ✅ Git 仓库已初始化
- ✅ 代码已提交 (commit: 3043130)
- ✅ 准备推送到 GitHub
- ⏳ 等待 GitHub 仓库创建
- ⏳ 等待 Cloudflare Pages 部署

### 构建信息
- **框架**: Vue 3 + Vite
- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **部署平台**: Cloudflare Pages

### 技术栈
- Vue 3 (Composition API)
- Tailwind CSS
- Vite
- LocalStorage (数据持久化)

---

## 📞 需要帮助?

如果遇到问题,可以:
1. 检查 Cloudflare Pages 构建日志
2. 查看 GitHub Actions (如果配置了)
3. 在项目 Issues 中提问

---

## 🎉 完成!

按照以上步骤操作后,您的应用将:
- ✅ 托管在 GitHub (代码管理)
- ✅ 部署在 Cloudflare Pages (全球 CDN 加速)
- ✅ 支持自动化部署 (推送即部署)
- ✅ 免费使用 (Cloudflare Pages 免费套餐)

**下一步**: 创建 GitHub 仓库,然后执行推送命令!
