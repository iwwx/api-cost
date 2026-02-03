/**
 * API 请求工具函数
 */

/**
 * 标准化 API URL (移除尾部斜杠)
 * @param {string} url - 原始 URL
 * @returns {string} 标准化后的 URL
 */
export function normalizeApiUrl(url) {
  return url.replace(/\/+$/, '')
}

/**
 * 构建完整的 API 端点
 * @param {string} baseUrl - 基础 URL
 * @param {string} endpoint - 端点路径
 * @returns {string} 完整 URL
 */
export function buildEndpoint(baseUrl, endpoint) {
  const base = normalizeApiUrl(baseUrl)
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

/**
 * 发送带认证的 API 请求
 * @param {string} url - 请求 URL
 * @param {string} apiKey - API Key
 * @param {Object} options - fetch 选项
 * @returns {Promise<Object>} 响应数据
 */
export async function fetchWithAuth(url, apiKey, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 查询账户余额 (OpenAI 兼容接口)
 * @param {string} baseUrl - API 基础 URL
 * @param {string} apiKey - API Key
 * @returns {Promise<Object>} 余额信息
 */
export async function queryBalance(baseUrl, apiKey) {
  try {
    // 方法1: 尝试 OpenAI 标准接口 (需要两个接口)
    const [subscriptionData, usageData] = await Promise.all([
      fetchWithAuth(buildEndpoint(baseUrl, '/v1/dashboard/billing/subscription'), apiKey).catch(() => null),
      fetchWithAuth(buildEndpoint(baseUrl, '/v1/dashboard/billing/usage'), apiKey).catch(() => null)
    ])

    if (subscriptionData && usageData) {
      const total = subscriptionData.hard_limit_usd || 0
      const used = usageData.total_usage ? usageData.total_usage / 100 : 0 // 通常返回的是分,需要除以100
      const expiresAt = subscriptionData.access_until || subscriptionData.expires_at || null

      return {
        total,
        used,
        remaining: total - used,
        expiresAt,
        currency: 'USD'
      }
    }

    // 方法2: 如果上面失败,尝试只用 subscription 接口 (某些兼容 API)
    if (subscriptionData) {
      const total = subscriptionData.hard_limit_usd || subscriptionData.system_hard_limit_usd || 0
      const used = subscriptionData.soft_limit_usd || 0
      const expiresAt = subscriptionData.access_until || subscriptionData.expires_at || null

      return {
        total,
        used,
        remaining: total - used,
        expiresAt,
        currency: 'USD'
      }
    }

    // 方法3: 尝试简化的余额接口 (某些第三方 API)
    const balanceUrl = buildEndpoint(baseUrl, '/v1/balance')
    const balanceData = await fetchWithAuth(balanceUrl, apiKey).catch(() => null)

    if (balanceData) {
      const total = balanceData.total_granted || balanceData.total_available || 0
      const used = balanceData.total_used || 0
      const expiresAt = balanceData.expires_at || balanceData.access_until || balanceData.expiry_time || null

      return {
        total,
        used,
        remaining: balanceData.total_available || (total - used),
        expiresAt,
        currency: 'USD'
      }
    }

    throw new Error('无法获取余额信息')
  } catch (error) {
    throw new Error(`余额查询失败: ${error.message}`)
  }
}

/**
 * 查询可用模型列表
 * @param {string} baseUrl - API 基础 URL
 * @param {string} apiKey - API Key
 * @returns {Promise<Array>} 模型列表
 */
export async function queryModels(baseUrl, apiKey) {
  const url = buildEndpoint(baseUrl, '/v1/models')
  const data = await fetchWithAuth(url, apiKey)

  return data.data || []
}

/**
 * 并发查询多个 API Key
 * @param {string} baseUrl - API 基础 URL
 * @param {Array<string>} apiKeys - API Key 数组
 * @param {Function} queryFn - 查询函数
 * @returns {Promise<Array>} 查询结果数组
 */
export async function batchQuery(baseUrl, apiKeys, queryFn) {
  const promises = apiKeys.map(async (key, index) => {
    try {
      const result = await queryFn(baseUrl, key)
      return { success: true, key, index, data: result }
    } catch (error) {
      return { success: false, key, index, error: error.message }
    }
  })

  return Promise.all(promises)
}
