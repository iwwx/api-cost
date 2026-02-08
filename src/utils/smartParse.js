/**
 * 智能解析粘贴文本,提取 API 地址和 API Key
 * @param {string} text - 粘贴的文本内容
 * @returns {Object} { url: string | null, keys: string[] }
 */
export function parseApiInfo(text) {
  if (!text || !text.trim()) {
    return { url: null, keys: [] }
  }

  const result = {
    url: null,
    keys: []
  }

  // 分行处理
  const lines = text.split(/[\r\n]+/).map(line => line.trim()).filter(Boolean)

  // 正则表达式模式
  const urlPatterns = [
    // 匹配环境变量格式: export XXX_URL="..." 或 XXX_URL=...
    /(?:export\s+)?[A-Z_]*(?:BASE_?URL|URL|ENDPOINT|API)[A-Z_]*\s*=\s*["']?(https?:\/\/[^\s,，;；"']+)["']?/i,
    // 匹配 "Base URL:", "URL:", "API:", "地址:", "接口:" 等标签后的 URL
    /(?:base\s*url|url|api|endpoint|地址|接口|base\s*path|api\s*url|api\s*endpoint)[\s:：]*[=]?\s*["']?(https?:\/\/[^\s,，;；"']+)["']?/i,
    // 匹配纯 URL (必须是 https?:// 开头)
    /(https?:\/\/[^\s,，;；"']+)/i
  ]

  const keyPatterns = [
    // 匹配环境变量格式: export XXX_KEY="..." 或 XXX_TOKEN=...
    /(?:export\s+)?[A-Z_]*(?:KEY|TOKEN|SECRET|AUTH)[A-Z_]*\s*=\s*["']?([a-zA-Z0-9._-]{20,})["']?/i,
    // 匹配 "key:", "API Key:", "token:", "密钥:" 等标签后的密钥
    /(?:api[\s_-]?key|key|token|secret|密钥|令牌|authorization)[\s:：]*[=]?\s*["']?([a-zA-Z0-9._-]{20,}|sk-[a-zA-Z0-9_-]+|Bearer\s+[a-zA-Z0-9._-]+)["']?/i,
    // 匹配 sk- 开头的密钥
    /(sk-[a-zA-Z0-9_-]{20,})/,
    // 匹配 Bearer 开头的密钥 (完整格式)
    /(Bearer\s+[a-zA-Z0-9._-]{20,})/i,
    // 匹配长字符串密钥 (至少30个字符,包含字母数字和部分特殊字符)
    /([a-zA-Z0-9._-]{30,})/
  ]

  // 提取 URL
  for (const line of lines) {
    for (const pattern of urlPatterns) {
      const match = line.match(pattern)
      if (match) {
        const extractedUrl = (match[1] || match[0]).replace(/["',;]+$/, '') // 移除末尾的引号、逗号、分号
        // 验证是否为有效 URL
        try {
          const urlObj = new URL(extractedUrl)
          if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            result.url = extractedUrl.replace(/\/$/, '') // 移除末尾的斜杠
            break
          }
        } catch (e) {
          // 无效 URL,继续尝试
        }
      }
    }
    if (result.url) break
  }

  // 提取 API Keys
  const keySet = new Set() // 使用 Set 去重
  const processedTokens = new Set() // 追踪已处理的 Bearer token

  for (const line of lines) {
    for (const pattern of keyPatterns) {
      const match = line.match(pattern)
      if (match) {
        let extractedKey = (match[1] || match[0]).replace(/["',;]+$/, '').trim() // 清理格式

        // 过滤掉明显不是密钥的内容
        if (extractedKey.length < 20) continue
        if (extractedKey === result.url) continue // 避免把 URL 当作密钥

        // 如果是 URL,跳过
        if (extractedKey.startsWith('http://') || extractedKey.startsWith('https://')) {
          continue
        }

        // 处理 Bearer token,避免重复
        if (extractedKey.startsWith('Bearer ')) {
          const token = extractedKey.substring(7).trim() // 提取 Bearer 后面的 token
          if (!processedTokens.has(token)) {
            processedTokens.add(token)
            keySet.add(extractedKey) // 保留完整的 Bearer token
          }
        } else if (extractedKey.startsWith('sk-') || extractedKey.length >= 30) {
          // 检查是否已作为 Bearer token 的一部分被处理
          if (!processedTokens.has(extractedKey)) {
            keySet.add(extractedKey)
          }
        } else {
          keySet.add(extractedKey)
        }
      }
    }
  }

  result.keys = Array.from(keySet)

  return result
}

/**
 * 格式化解析结果用于预览
 * @param {Object} parseResult - parseApiInfo 的返回结果
 * @returns {string} 格式化的文本
 */
export function formatParseResult(parseResult) {
  const parts = []

  if (parseResult.url) {
    parts.push(`📍 API 地址: ${parseResult.url}`)
  }

  if (parseResult.keys && parseResult.keys.length > 0) {
    parts.push(`🔑 API Key (${parseResult.keys.length}个):`)
    parseResult.keys.forEach((key, index) => {
      const masked = key.length > 20
        ? key.substring(0, 10) + '...' + key.substring(key.length - 6)
        : key.substring(0, 8) + '...'
      parts.push(`   ${index + 1}. ${masked}`)
    })
  }

  return parts.join('\n')
}
