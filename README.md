# 🚀 API 查询工具

一个简洁优雅的 OpenAI 兼容 API 批量查询工具,支持余额查询和模型列表获取。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.5-brightgreen.svg)
![Vite](https://img.shields.io/badge/vite-5.4-646CFF.svg)
![Tailwind](https://img.shields.io/badge/tailwind-3.4-38B2AC.svg)

## 🚀 快速部署

### 方式一: Cloudflare Pages (推荐)

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/iwwx/api-cost-query)

**点击上方按钮即可:**
- 自动 Fork 仓库到您的 GitHub
- 自动连接到 Cloudflare Pages
- 自动配置构建设置
- 一键完成部署

**或手动部署:**
1. Fork 本仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
4. 选择 `api-cost-query` 仓库
5. 构建配置会自动读取 `wrangler.toml`
6. 点击 **Save and Deploy**

---

## ✨ 核心特性

- ✅ **批量查询** - 支持多个 API Key 同时查询
- ✅ **余额监控** - 实时查看总额度、已使用、剩余额度
- ✅ **模型管理** - 智能分类展示可用模型 (14+ 分类)
- ✅ **历史记录** - 自动保存 URL 和 Key 历史 (LocalStorage)
- ✅ **数据导出** - 支持 JSON 和 CSV 格式导出
- ✅ **响应式设计** - 完美适配桌面端和移动端
- ✅ **零依赖** - 仅依赖 Vue 3,无额外运行时库

---

## 📸 截图预览

```
┌─────────────────────────────────────────┐
│           API 查询工具                   │
│     快速查询 API 余额与模型列表          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  API 配置                                │
│  ┌───────────────────────────────────┐  │
│  │ 快速选择平台:                      │  │
│  │ [OpenAI] [硅基流动] [DeepSeek]...  │  │
│  │                                    │  │
│  │ API 地址: https://api.openai.com  │  │
│  │ API Key: sk-proj-...              │  │
│  │         sk-proj-...              │  │
│  │                                    │  │
│  │      [查询余额与模型] 🔍           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  余额查询结果                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 密钥 #1 │ │ 密钥 #2 │ │ 密钥 #3 │   │
│  │ $5.00   │ │ $10.00  │ │ $3.00   │   │
│  │ 已用: 1 │ │ 已用: 8 │ │ 已用: 2 │   │
│  │ ███░░   │ │ ████████│ │ ██░░░   │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.5+ | 前端框架 (Composition API) |
| Vite | 5.4+ | 构建工具 |
| Tailwind CSS | 3.4+ | 样式框架 |
| JavaScript | ES2022 | 开发语言 |

---

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录

### 4. 预览生产构建

```bash
npm run preview
```

---

## 📖 使用指南

### 基本流程

1. **选择 API 平台** - 点击预设平台或手动输入 API 地址
2. **输入 API Key** - 支持多行输入,每行一个密钥
3. **点击查询** - 系统自动并发查询余额和模型
4. **查看结果** - 余额卡片和模型分类展示
5. **导出数据** - 可选导出 JSON 或 CSV 格式

### 支持的 API 平台

- ✅ OpenAI 官方 (`https://api.openai.com`)
- ✅ 硅基流动 (`https://api.siliconflow.cn`)
- ✅ DeepSeek (`https://api.deepseek.com`)
- ✅ 月之暗面 (`https://api.moonshot.cn`)
- ✅ 智谱AI (`https://open.bigmodel.cn`)
- ✅ Cloudflare AI (`https://api.cloudflare.com/client/v4/accounts`)
- ✅ 所有 OpenAI 兼容接口

### API Key 格式

```
sk-proj-...
sk-...
Bearer ...
```

---

## 🎨 功能详解

### 余额查询

- **总额度** - 账户总信用额度
- **已使用** - 累计消费金额
- **剩余额度** - 可用余额
- **使用率** - 可视化进度条 (颜色渐变)

### 模型列表

**智能分类:**
- OpenAI (GPT, O1, O3)
- Claude (Claude系列)
- Google (Gemini, PaLM)
- Meta (LLaMA)
- Mistral
- DeepSeek
- 千问 (Qwen)
- 文心 (ERNIE)
- 讯飞 (Spark)
- 智谱 (GLM, ChatGLM)
- 月之暗面 (Moonshot)
- Cohere
- Embedding
- 其他

**操作:**
- 🔍 实时搜索过滤
- 📋 点击模型名称复制
- 📁 折叠/展开分类
- 💾 导出 JSON/CSV

---

## 📁 项目结构

```
cost/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── ApiForm.vue      # API 配置表单
│   │   ├── BalanceTable.vue # 余额展示
│   │   ├── ModelGrid.vue    # 模型列表
│   │   ├── HistoryDialog.vue# 历史记录
│   │   ├── LoadingSpinner.vue# 加载动画
│   │   └── Toast.vue        # Toast 通知
│   ├── composables/         # 组合式函数
│   │   ├── useStorage.js    # 存储管理
│   │   ├── useToast.js      # 通知系统
│   │   └── useClipboard.js  # 剪贴板
│   ├── utils/               # 工具函数
│   │   ├── validators.js    # 表单验证
│   │   ├── api.js           # API 请求
│   │   ├── formatters.js    # 数据格式化
│   │   └── export.js        # 文件导出
│   ├── assets/
│   │   └── main.css         # 全局样式
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── public/                  # 静态资源
├── dist/                    # 构建输出
├── index.html
├── package.json
├── vite.config.js           # Vite 配置
└── tailwind.config.js       # Tailwind 配置
```

---

## 🔧 配置说明

### Vite 配置 (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue']  // 分离 Vue 核心库
        }
      }
    }
  }
})
```

### Tailwind 配置 (`tailwind.config.js`)

```javascript
theme: {
  extend: {
    colors: {
      accent: { DEFAULT: '#3B82F6' },
      success: '#10B981',
      error: '#EF4444',
      // ... 更多自定义颜色
    }
  }
}
```

---

## 🚀 部署指南

### Cloudflare Pages (推荐)

**方式 1: 通过 GitHub 连接 (推荐)**

1. Fork 本仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Workers & Pages** → **Create application** → **Pages**
4. 连接 GitHub 仓库并配置:
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   ```
5. 部署完成后获得 `https://your-project.pages.dev`

**方式 2: 使用 Wrangler CLI**

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署到 Pages
wrangler pages deploy dist --project-name=api-cost-query
```

**特点:**
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 无限带宽
- ✅ Git 推送自动部署
- ✅ 免费使用

---

### 其他平台

#### Vercel

```bash
npm run build
vercel --prod
```

#### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔒 安全说明

### 数据隐私

- ✅ **纯客户端运行** - 无服务器,无数据上传
- ✅ **本地存储** - 历史记录仅保存在浏览器 LocalStorage
- ✅ **密钥脱敏** - 界面自动隐藏敏感信息
- ✅ **HTTPS 强制** - API 地址必须使用 HTTPS

### 建议

- 🔐 不要在公共设备上使用
- 🔐 定期清理浏览器历史记录
- 🔐 避免在生产环境使用测试密钥

---

## 🧪 测试示例

### 测试 API (免费)

```
URL: https://api.siliconflow.cn
Key: sk-test-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📊 性能指标

| 指标 | 数值 |
|------|------|
| 首屏加载时间 | < 1s |
| 构建产物大小 | 115 KB (未压缩) |
| Gzip 压缩后 | ~43 KB |
| Vue 核心库 | 71 KB (分离缓存) |
| 应用代码 | 26 KB |

---

## 🛠️ 开发指南

### 添加新平台预设

编辑 `src/components/ApiForm.vue`:

```javascript
const presets = [
  { name: '新平台', url: 'https://api.example.com' }
]
```

### 添加模型分类

编辑 `src/components/ModelGrid.vue`:

```javascript
const categories = [
  { name: '新分类', keywords: ['keyword1', 'keyword2'] }
]
```

### 修改颜色主题

编辑 `tailwind.config.js`:

```javascript
colors: {
  accent: { DEFAULT: '#your-color-hex' }
}
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 **SOLID** 原则
- 遵循 **KISS** (简单至上)
- 遵循 **DRY** (杜绝重复)
- 遵循 **YAGNI** (精益求精)
- 使用 ESLint 检查代码质量

---

## 📝 更新日志

### v1.0.0 (2025-02-03)

- ✨ 初始版本发布
- ✅ 批量 API Key 查询
- ✅ 余额监控
- ✅ 模型分类展示
- ✅ 历史记录管理
- ✅ 数据导出 (JSON/CSV)
- ✅ 响应式设计

---

## 📄 许可证

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 💬 联系方式

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/api-query-tool/issues)

---

## 🙏 致谢

感谢以下开源项目:

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

---

**⭐ 如果这个项目对你有帮助,请给个 Star!**
