/**
 * 脱敏显示 API Key
 * @param {string} key - API Key
 * @param {number} visibleChars - 可见字符数 (前后各显示)
 * @returns {string} 脱敏后的 Key
 */
export function maskApiKey(key, visibleChars = 8) {
  if (!key || key.length <= visibleChars * 2) {
    return key
  }

  const start = key.slice(0, visibleChars)
  const end = key.slice(-visibleChars)
  const masked = '*'.repeat(Math.min(16, key.length - visibleChars * 2))

  return `${start}${masked}${end}`
}
