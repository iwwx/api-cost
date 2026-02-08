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

  // 方法1: 直接用字符串查找 http:// 或 https://
  let urlStart = text.indexOf('https://')
  if (urlStart === -1) {
    urlStart = text.indexOf('http://')
  }

  if (urlStart !== -1) {
    // 从 http 开始,找到 URL 结束位置 (空格、引号、换行等)
    let urlEnd = urlStart
    const stopChars = [' ', '"', "'", '\n', '\r', '\t', ',', ';', '，', '；']

    for (let i = urlStart; i < text.length; i++) {
      if (stopChars.includes(text[i])) {
        break
      }
      urlEnd = i + 1
    }

    const extractedUrl = text.substring(urlStart, urlEnd)

    // 验证 URL
    try {
      const urlObj = new URL(extractedUrl)
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        // 移除末尾斜杠
        result.url = extractedUrl.replace(/\/+$/, '')
      }
    } catch (e) {
      // URL 无效,忽略
    }
  }

  // 方法2: 查找 sk- 开头的密钥
  const skPattern = /sk-[a-zA-Z0-9_-]{20,}/g
  let skMatch
  while ((skMatch = skPattern.exec(text)) !== null) {
    const key = skMatch[0]
    if (!result.keys.includes(key)) {
      result.keys.push(key)
    }
  }

  // 方法3: 查找引号内的长字符串 (可能是密钥)
  const quotedPattern = /["']([a-zA-Z0-9._-]{30,})["']/g
  let quotedMatch
  while ((quotedMatch = quotedPattern.exec(text)) !== null) {
    const key = quotedMatch[1]
    // 排除 URL
    if (key.startsWith('http')) continue
    // 排除已添加的
    if (result.keys.includes(key)) continue
    result.keys.push(key)
  }

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
    parts.push('📍 API 地址: ' + parseResult.url)
  }

  if (parseResult.keys && parseResult.keys.length > 0) {
    parts.push('🔑 API Key (' + parseResult.keys.length + '个):')
    parseResult.keys.forEach(function(key, index) {
      let masked
      if (key.length > 20) {
        masked = key.substring(0, 10) + '...' + key.substring(key.length - 6)
      } else {
        masked = key.substring(0, 8) + '...'
      }
      parts.push('   ' + (index + 1) + '. ' + masked)
    })
  }

  return parts.join('\n')
}
