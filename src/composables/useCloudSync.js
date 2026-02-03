import { ref, watch } from 'vue'
import { useStorage } from './useStorage'
import { uploadToCloud, downloadFromCloud } from '@/utils/cloudApi'

/**
 * 云端同步增强版存储
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @param {Object} options - 配置选项
 */
export function useCloudSync(key, defaultValue, options = {}) {
  const {
    autoSync = true,        // 自动同步
    syncInterval = 30000,   // 同步间隔 (30秒)
    onSyncSuccess = null,   // 同步成功回调
    onSyncError = null      // 同步失败回调
  } = options

  // 本地存储层
  const localStorage = useStorage(key, defaultValue)

  // 同步状态
  const syncing = ref(false)
  const lastSyncTime = ref(null)
  const syncError = ref(null)
  const cloudSyncEnabled = ref(
    window.localStorage.getItem('_cloud_sync_enabled') !== 'false'
  )

  // 上传到云端
  const syncToCloud = async () => {
    if (!cloudSyncEnabled.value) return

    syncing.value = true
    syncError.value = null

    try {
      // 收集所有需要同步的数据
      const allData = {
        'platform-presets': JSON.parse(window.localStorage.getItem('platform-presets') || '{"custom":[],"builtInOverrides":{}}'),
        'api-urls': JSON.parse(window.localStorage.getItem('api-urls') || '[]'),
        'api-keys': JSON.parse(window.localStorage.getItem('api-keys') || '[]')
      }

      const result = await uploadToCloud(allData)
      lastSyncTime.value = result.timestamp

      if (onSyncSuccess) {
        onSyncSuccess(result)
      }
    } catch (error) {
      console.warn('[CloudSync] Upload failed:', error)
      syncError.value = error.message

      if (onSyncError) {
        onSyncError(error)
      }
    } finally {
      syncing.value = false
    }
  }

  // 从云端下载
  const syncFromCloud = async () => {
    if (!cloudSyncEnabled.value) return

    syncing.value = true
    syncError.value = null

    try {
      const cloudData = await downloadFromCloud()

      // 如果有元数据,检查是否需要更新
      if (cloudData._meta) {
        const cloudTime = cloudData._meta.lastSync
        const localTime = lastSyncTime.value || 0

        if (cloudTime <= localTime) {
          console.log('[CloudSync] Local data is up to date')
          return
        }
      }

      // 更新本地数据
      if (cloudData['platform-presets']) {
        window.localStorage.setItem('platform-presets', JSON.stringify(cloudData['platform-presets']))
      }
      if (cloudData['api-urls']) {
        window.localStorage.setItem('api-urls', JSON.stringify(cloudData['api-urls']))
      }
      if (cloudData['api-keys']) {
        window.localStorage.setItem('api-keys', JSON.stringify(cloudData['api-keys']))
      }

      lastSyncTime.value = cloudData._meta?.lastSync || Date.now()

      // 刷新页面以应用新数据
      window.location.reload()

    } catch (error) {
      console.warn('[CloudSync] Download failed:', error)
      syncError.value = error.message

      if (onSyncError) {
        onSyncError(error)
      }
    } finally {
      syncing.value = false
    }
  }

  // 监听本地数据变化,自动同步到云端
  if (autoSync) {
    watch(localStorage.value, () => {
      syncToCloud()
    }, { deep: true })
  }

  // 定时从云端拉取更新
  if (cloudSyncEnabled.value && autoSync) {
    setInterval(() => {
      syncFromCloud()
    }, syncInterval)
  }

  // 切换云端同步
  const toggleCloudSync = (enabled) => {
    cloudSyncEnabled.value = enabled
    window.localStorage.setItem('_cloud_sync_enabled', enabled.toString())

    if (enabled) {
      // 立即同步
      syncToCloud()
    }
  }

  return {
    ...localStorage,
    syncing,
    lastSyncTime,
    syncError,
    cloudSyncEnabled,
    syncToCloud,
    syncFromCloud,
    toggleCloudSync
  }
}
