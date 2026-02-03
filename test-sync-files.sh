#!/bin/bash

# Cloudflare KV 云端同步功能快速测试脚本

echo "================================"
echo "云端同步功能文件检查"
echo "================================"

# 检查必需文件
FILES=(
  "functions/api/sync.js"
  "src/utils/deviceId.js"
  "src/utils/cloudApi.js"
  "src/composables/useCloudSync.js"
  "src/components/SyncSettings.vue"
  "wrangler.toml"
)

MISSING=0

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "================================"
echo "代码语法检查"
echo "================================"

# 检查 JavaScript 语法 (如果有 Node.js)
if command -v node &> /dev/null; then
  echo "检查 sync.js..."
  node -c functions/api/sync.js 2>&1 && echo "✅ sync.js 语法正确" || echo "❌ sync.js 语法错误"

  echo "检查 deviceId.js..."
  node -c src/utils/deviceId.js 2>&1 && echo "✅ deviceId.js 语法正确" || echo "❌ deviceId.js 语法错误"

  echo "检查 cloudApi.js..."
  node -c src/utils/cloudApi.js 2>&1 && echo "✅ cloudApi.js 语法正确" || echo "❌ cloudApi.js 语法错误"
else
  echo "⚠️ 未安装 Node.js, 跳过语法检查"
fi

echo ""
echo "================================"
echo "Git 状态"
echo "================================"
git status --short

echo ""
echo "================================"
echo "总结"
echo "================================"

if [ $MISSING -eq 0 ]; then
  echo "✅ 所有必需文件已创建"
  echo ""
  echo "下一步操作:"
  echo "1. 在 Cloudflare Dashboard 创建 KV Namespace"
  echo "2. 绑定 KV 到 Pages 项目"
  echo "3. git add . && git commit -m 'feat: 添加云端同步功能' && git push"
  echo "4. 等待 Cloudflare Pages 部署完成"
  echo "5. 参考 CLOUDFLARE_KV_SYNC_GUIDE.md 进行测试"
else
  echo "❌ 缺失 $MISSING 个文件, 请检查"
fi

echo ""
