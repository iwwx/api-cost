import { parseApiInfo, formatParseResult } from '../src/utils/smartParse.js'

// 测试用例
const testCases = [
  {
    name: '标准格式',
    input: `Base URL:https://kiro2api-node.zeabur.app
key:sk-hdushdgsg988hfuhftte6bbst5rwvv
协议:Anthropic`,
    expected: {
      url: 'https://kiro2api-node.zeabur.app',
      keyCount: 1
    }
  },
  {
    name: '带空格和冒号',
    input: `Base URL: https://api.openai.com
API Key: sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`,
    expected: {
      url: 'https://api.openai.com',
      keyCount: 2
    }
  },
  {
    name: '多行纯文本',
    input: `这是我的配置信息
地址是 https://api.deepseek.com/v1
密钥是 sk-1234567890abcdefghijklmnopqrstuvwxyz
请妥善保管`,
    expected: {
      url: 'https://api.deepseek.com/v1',
      keyCount: 1
    }
  },
  {
    name: '多个密钥',
    input: `API: https://api.siliconflow.cn
key1: sk-aaaaaaaaaaaaaaaaaaaaaaaaaa
key2: sk-bbbbbbbbbbbbbbbbbbbbbbbbbb
key3: sk-cccccccccccccccccccccccccc`,
    expected: {
      url: 'https://api.siliconflow.cn',
      keyCount: 3
    }
  },
  {
    name: '中文标签',
    input: `接口地址:https://api.moonshot.cn/v1
API密钥:sk-moonshot1234567890abcdefghijk
令牌有效期:永久`,
    expected: {
      url: 'https://api.moonshot.cn/v1',
      keyCount: 1
    }
  },
  {
    name: '无标签纯URL',
    input: `https://open.bigmodel.cn
sk-zhipuai1234567890abcdefghijklmnopqrst`,
    expected: {
      url: 'https://open.bigmodel.cn',
      keyCount: 1
    }
  },
  {
    name: '复杂混合格式',
    input: `=== API 配置信息 ===
服务商: OpenRouter
Base URL = https://openrouter.ai/api/v1
Authorization: Bearer sk-or-v1-1234567890abcdefghijklmnopqrstuvwxyz1234567890
备注: 测试账号`,
    expected: {
      url: 'https://openrouter.ai/api/v1',
      keyCount: 1
    }
  },
  {
    name: 'JSON 格式',
    input: `{
  "url": "https://api.anthropic.com",
  "apiKey": "sk-ant-api03-1234567890abcdefghijklmnopqrstuvwxyz",
  "model": "claude-3-opus"
}`,
    expected: {
      url: 'https://api.anthropic.com',
      keyCount: 1
    }
  }
]

// 运行测试
console.log('🧪 开始智能解析测试...\n')

testCases.forEach((testCase, index) => {
  console.log(`\n📋 测试用例 ${index + 1}: ${testCase.name}`)
  console.log('输入:')
  console.log(testCase.input)
  console.log('\n解析结果:')

  const result = parseApiInfo(testCase.input)

  console.log(`URL: ${result.url || '(未识别)'}`)
  console.log(`Keys (${result.keys.length}):`, result.keys)

  // 验证
  const urlMatch = result.url === testCase.expected.url
  const keyCountMatch = result.keys.length === testCase.expected.keyCount

  if (urlMatch && keyCountMatch) {
    console.log('✅ 测试通过')
  } else {
    console.log('❌ 测试失败')
    if (!urlMatch) {
      console.log(`  - URL 不匹配: 期望 "${testCase.expected.url}", 实际 "${result.url}"`)
    }
    if (!keyCountMatch) {
      console.log(`  - Key 数量不匹配: 期望 ${testCase.expected.keyCount}, 实际 ${result.keys.length}`)
    }
  }

  console.log('\n格式化预览:')
  console.log(formatParseResult(result))
  console.log('\n' + '='.repeat(60))
})

console.log('\n\n✨ 所有测试完成!')
