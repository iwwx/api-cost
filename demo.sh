#!/bin/bash

echo "======================================"
echo "  智能粘贴识别功能 - 快速演示"
echo "======================================"
echo ""

# 测试示例
TEST_CASES=(
  "Base URL:https://kiro2api-node.zeabur.app\nkey:sk-hdushdgsg988hfuhftte6bbst5rwvv\n协议:Anthropic"
  "接口地址: https://api.openai.com\nAPI密钥: sk-proj-abcdefghijklmnopqrstuvwxyz"
  "https://api.deepseek.com\nsk-deepseek1234567890abcdefghijklmnop"
)

echo "运行智能解析测试..."
echo ""

node test/smartParse.test.js 2>&1 | grep -E "(测试用例|✅|✨)"

echo ""
echo "======================================"
echo "  功能特性"
echo "======================================"
echo ""
echo "✅ 支持 8+ 种文本格式"
echo "✅ 自动识别 URL 和 API Key"
echo "✅ 中英文混合支持"
echo "✅ 智能去重机制"
echo "✅ 安全脱敏显示"
echo "✅ 一键应用到表单"
echo ""
echo "======================================"
echo "  使用方法"
echo "======================================"
echo ""
echo "1. 启动开发服务器: npm run dev"
echo "2. 打开浏览器访问应用"
echo "3. 在「一键智能识别」区域粘贴配置文本"
echo "4. 查看识别结果预览"
echo "5. 点击「应用到下方表单」按钮"
echo ""
echo "详细文档: SMART_PASTE_GUIDE.md"
echo "======================================"
