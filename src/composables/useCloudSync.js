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
  const lastSyncTime = ref(
    parseInt(window.localStorage.getItem('_last_sync_time')) || 0
  )
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

      // 持久化同步时间
      window.localStorage.setItem('_last_sync_time', result.timestamp.toString())

      if (onSyncSuccess) {
        onSyncSuccess(result)
      }

      console.log('[CloudSync] Upload successful, timestamp:', result.timestamp)
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
  const syncFromCloud = async (forceSync = false) => {
    if (!cloudSyncEnabled.value) return

    // 防止无限刷新: 检查是否刚刚刷新过 (5秒内)
    // 但如果是定时触发的同步 (forceSync=true),则允许
    if (!forceSync) {
      const lastReloadTime = parseInt(window.localStorage.getItem('_last_reload_time')) || 0
      const now = Date.now()
      if (now - lastReloadTime < 5000) {
        console.log('[CloudSync] Just reloaded, skipping sync to prevent infinite loop')
        return
      }
    }

    syncing.value = true
    syncError.value = null

    try {
      const cloudData = await downloadFromCloud()

      console.log('[CloudSync] Downloaded data:', cloudData)

      // 检查是否有数据
      if (!cloudData || Object.keys(cloudData).length === 0) {
        console.log('[CloudSync] No cloud data found')
        return
      }

      // 如果有元数据,检查是否需要更新
      if (cloudData._meta) {
        const cloudTime = cloudData._meta.lastSync
        const localTime = lastSyncTime.value || 0

        console.log('[CloudSync] Timestamp check - Cloud:', cloudTime, 'Local:', localTime)

        if (cloudTime <= localTime) {
          console.log('[CloudSync] Local data is up to date, skipping')
          return
        }
      }

      // 检查数据是否真的不同
      let hasChanges = false

      // 更新本地数据
      if (cloudData['platform-presets']) {
        const currentPresets = window.localStorage.getItem('platform-presets')
        const newPresets = JSON.stringify(cloudData['platform-presets'])
        if (currentPresets !== newPresets) {
          window.localStorage.setItem('platform-presets', newPresets)
          hasChanges = true
        }
      }

      if (cloudData['api-urls']) {
        const currentUrls = window.localStorage.getItem('api-urls')
        const newUrls = JSON.stringify(cloudData['api-urls'])
        if (currentUrls !== newUrls) {
          window.localStorage.setItem('api-urls', newUrls)
          hasChanges = true
        }
      }

      if (cloudData['api-keys']) {
        const currentKeys = window.localStorage.getItem('api-keys')
        const newKeys = JSON.stringify(cloudData['api-keys'])
        if (currentKeys !== newKeys) {
          window.localStorage.setItem('api-keys', newKeys)
          hasChanges = true
        }
      }

      if (cloudData._meta?.lastSync) {
        lastSyncTime.value = cloudData._meta.lastSync
        window.localStorage.setItem('_last_sync_time', cloudData._meta.lastSync.toString())
      }

      if (hasChanges) {
        console.log('[CloudSync] Data updated from cloud, reloading page...')
        // 记录刷新时间,防止无限循环
        window.localStorage.setItem('_last_reload_time', Date.now().toString())
        // 等待一小段时间确保 localStorage 写入完成
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        console.log('[CloudSync] No changes detected, skipping reload')
      }

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
    // 延迟首次拉取,避免页面刚加载就触发刷新
    setTimeout(() => {
      syncFromCloud(true) // forceSync=true,忽略防护期
    }, 6000) // 6秒后首次拉取 (超过5秒防护期)

    // 然后定时拉取
    setInterval(() => {
      syncFromCloud(true) // forceSync=true,允许定时同步
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
