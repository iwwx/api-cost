<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- 头部 -->
      <header class="text-center">
        <h1 class="text-4xl font-bold mb-3 text-text-primary">API 查询工具</h1>
        <p class="text-text-secondary text-lg">快速查询 API 余额与模型列表</p>
      </header>

      <!-- API 配置表单 -->
      <ApiForm ref="apiFormRef" @query="handleQuery" />

      <!-- 余额结果 -->
      <BalanceTable
        :balances="balances"
        :loading="balanceLoading"
        @export="exportBalances"
      />

      <!-- 模型列表 -->
      <ModelGrid
        :models="models"
        :loading="modelsLoading"
        @export-json="exportModelsJSON"
        @export-csv="exportModelsCSV"
      />

      <!-- Toast 通知容器 -->
      <div class="fixed bottom-8 right-8 z-50 flex flex-col-reverse gap-3">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :message="toast.message"
          :type="toast.type"
          @close="removeToast(toast.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ApiForm from './components/ApiForm.vue'
import BalanceTable from './components/BalanceTable.vue'
import ModelGrid from './components/ModelGrid.vue'
import Toast from './components/Toast.vue'
import { useToast } from './composables/useToast'
import { queryBalance, queryModels, batchQuery } from './utils/api'
import { exportToJSON, exportToCSV } from './utils/export'

// Toast 通知
const { toasts, remove: removeToast, error: showError } = useToast()

// 表单引用
const apiFormRef = ref(null)

// 数据状态
const balances = ref([])
const models = ref([])
const balanceLoading = ref(false)
const modelsLoading = ref(false)

/**
 * 处理查询请求
 */
const handleQuery = async ({ url, keys, platform }) => {
  // 重置数据
  balances.value = []
  models.value = []

  // 并发查询余额和模型
  await Promise.all([
    queryBalanceData(url, keys, platform),
    queryModelsData(url, keys)
  ])

  // 查询完成,停止表单加载状态
  if (apiFormRef.value) {
    apiFormRef.value.setLoading(false)
  }
}

/**
 * 查询余额
 */
const queryBalanceData = async (url, keys, platform) => {
  balanceLoading.value = true

  try {
    const results = await batchQuery(url, keys, queryBalance)

    balances.value = results.map((result) => {
      if (result.success) {
        return {
          key: result.key,
          total: result.data.total,
          used: result.data.used,
          remaining: result.data.remaining,
          expiresAt: result.data.expiresAt,
          usagePercent: result.data.total > 0
            ? (result.data.used / result.data.total) * 100
            : 0,
          platform
        }
      } else {
        return {
          key: result.key,
          error: result.error,
          platform
        }
      }
    })
  } catch (err) {
    showError(`余额查询失败: ${err.message}`)
  } finally {
    balanceLoading.value = false
  }
}

/**
 * 查询模型列表 (使用第一个有效的 Key)
 */
const queryModelsData = async (url, keys) => {
  modelsLoading.value = true

  try {
    let querySucceeded = false

    for (const key of keys) {
      try {
        const modelList = await queryModels(url, key)
        models.value = modelList.map(m => m.id || m.name || m).sort()
        querySucceeded = true
        break // 成功后退出循环
      } catch (err) {
        console.warn(`使用 Key ${key.slice(0, 10)}... 查询模型失败:`, err)
        continue // 尝试下一个 Key
      }
    }

    if (!querySucceeded) {
      showError('所有密钥均无法获取模型列表')
    }
  } catch (err) {
    showError(`模型查询失败: ${err.message}`)
  } finally {
    modelsLoading.value = false
  }
}

/**
 * 导出余额数据为 JSON
 */
const exportBalances = () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const filename = `余额数据-${timestamp}.json`

  exportToJSON(balances.value, filename)
}

/**
 * 导出模型列表为 JSON
 */
const exportModelsJSON = () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const filename = `模型列表-${timestamp}.json`

  exportToJSON(models.value, filename)
}

/**
 * 导出模型列表为 CSV
 */
const exportModelsCSV = () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const filename = `模型列表-${timestamp}.csv`

  const data = models.value.map((model, index) => ({
    index: index + 1,
    name: model
  }))

  const columns = [
    { key: 'index', label: '序号' },
    { key: 'name', label: '模型名称' }
  ]

  exportToCSV(data, filename, columns)
}
</script>
