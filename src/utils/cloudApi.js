import { getDeviceId } from './deviceId'

const API_ENDPOINT = '/api/sync'

/**
 * 上传数据到云端
 */
export async function uploadToCloud(data) {
  const deviceId = await getDeviceId()

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  return await response.json()
}

/**
 * 从云端下载数据
 */
export async function downloadFromCloud() {
  const deviceId = await getDeviceId()

  const response = await fetch(API_ENDPOINT, {
    method: 'GET',
    headers: {
      'X-Device-ID': deviceId
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Download failed')
  }

  return await response.json()
}

/**
 * 清除云端数据
 */
export async function clearCloudData() {
  const deviceId = await getDeviceId()

  const response = await fetch(API_ENDPOINT, {
    method: 'DELETE',
    headers: {
      'X-Device-ID': deviceId
    }
  })

  if (!response.ok) {
    throw new Error('Clear failed')
  }

  return await response.json()
}
