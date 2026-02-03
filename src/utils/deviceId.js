/**
 * 生成基于浏览器指纹的设备 ID
 */
export async function generateDeviceId() {
  // 检查是否已有设备 ID
  const stored = localStorage.getItem('_device_id')
  if (stored) return stored

  // 生成新的设备 ID
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency?.toString() || '0'
  ].join('|')

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(fingerprint)
  )

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const deviceId = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 32)

  // 存储设备 ID
  localStorage.setItem('_device_id', deviceId)

  return deviceId
}

/**
 * 获取当前设备 ID
 */
export async function getDeviceId() {
  return await generateDeviceId()
}

/**
 * 设置自定义同步码 (用于跨设备同步)
 */
export function setCustomSyncCode(code) {
  if (!code || code.length < 8) {
    throw new Error('同步码至少需要 8 个字符')
  }
  localStorage.setItem('_device_id', code)
  return code
}
