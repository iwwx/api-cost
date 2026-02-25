import { ref, watch } from 'vue'
import { saveToKV, loadFromKV } from '@/utils/kvStorage'

/**
 * KV 优先的存储 - KV 是唯一数据源
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 */
export function useKVStorage(key, defaultValue = null) {
  const storedValue = ref(defaultValue)
  const loading = ref(false)
  const error = ref(null)
  let isInitializing = false
  let debounceTimer = null

  // 从 KV 加载初始数据
  const loadData = async () => {
    loading.value = true
    error.value = null
    isInitializing = true

    try {
      const kvData = await loadFromKV()

      if (kvData && kvData[key] !== undefined) {
        storedValue.value = kvData[key]
        // 同时更新 LocalStorage 作为缓存
        window.localStorage.setItem(key, JSON.stringify(kvData[key]))
        console.log('[KV] Loaded data from KV:', key)
      } else {
        // KV 中没有数据,尝试从 LocalStorage 读取
        const localData = window.localStorage.getItem(key)
        if (localData) {
          try {
            storedValue.value = JSON.parse(localData)
          } catch {
            storedValue.value = JSON.parse(JSON.stringify(defaultValue))
          }
          console.log('[KV] No KV data, using local cache:', key)
        } else {
          storedValue.value = JSON.parse(JSON.stringify(defaultValue))
        }
      }
    } catch (err) {
      console.warn('[KV] Load failed, using local cache:', err)
      error.value = err.message

      // 降级到 LocalStorage
      const localData = window.localStorage.getItem(key)
      if (localData) {
        try {
          storedValue.value = JSON.parse(localData)
        } catch {
          storedValue.value = JSON.parse(JSON.stringify(defaultValue))
        }
      } else {
        storedValue.value = JSON.parse(JSON.stringify(defaultValue))
      }
    } finally {
      loading.value = false
      isInitializing = false
    }
  }

  // 保存数据到 KV
  const saveData = async () => {
    try {
      // 收集所有数据
      const getLocalData = (k, fallback) => {
        try {
          return JSON.parse(window.localStorage.getItem(k) || fallback)
        } catch {
          return JSON.parse(fallback)
        }
      }

      const allData = {
        'platform-presets': key === 'platform-presets'
          ? storedValue.value
          : getLocalData('platform-presets', '{"custom":[],"builtInOverrides":{}}'),
        'api-history': key === 'api-history'
          ? storedValue.value
          : getLocalData('api-history', '[]')
      }

      await saveToKV(allData)

      // 同时更新 LocalStorage 缓存
      window.localStorage.setItem(key, JSON.stringify(storedValue.value))

      console.log('[KV] Saved to KV:', key)
    } catch (err) {
      console.error('[KV] Save failed:', err)
      error.value = err.message

      // 即使保存失败,也更新 LocalStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue.value))
    }
  }

  // 防抖保存
  const debouncedSave = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(saveData, 300)
  }

  // 监听数据变化,防抖保存到 KV
  watch(storedValue, () => {
    if (isInitializing) return
    debouncedSave()
  }, { deep: true })

  // 工具方法
  const push = (item) => {
    if (!Array.isArray(storedValue.value)) {
      storedValue.value = []
    }
    if (!storedValue.value.includes(item)) {
      storedValue.value.unshift(item)
      if (storedValue.value.length > 20) {
        storedValue.value = storedValue.value.slice(0, 20)
      }
    }
  }

  const remove = (index) => {
    if (Array.isArray(storedValue.value)) {
      storedValue.value.splice(index, 1)
    }
  }

  const clear = () => {
    storedValue.value = JSON.parse(JSON.stringify(defaultValue))
  }

  // 页面加载时从 KV 读取
  loadData()

  return {
    value: storedValue,
    loading,
    error,
    push,
    remove,
    clear,
    reload: loadData
  }
}
