<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold text-text-primary">余额查询结果</h2>
      <button
        v-if="balances.length > 0"
        @click="$emit('export')"
        class="btn-secondary text-sm"
      >
        导出 JSON
      </button>
    </div>

    <!-- 加载骨架屏 -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="card animate-pulse"
      >
        <div class="h-6 bg-border rounded w-1/3 mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 bg-border rounded w-1/2"></div>
          <div class="h-4 bg-border rounded w-2/3"></div>
          <div class="h-3 bg-border rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- 余额卡片 -->
    <div v-else-if="balances.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(balance, index) in balances"
        :key="index"
        class="card"
      >
        <!-- 卡片头部 -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold text-text-primary">密钥 #{{ index + 1 }}</h3>
            <p class="text-xs text-text-secondary font-mono mt-1">
              {{ maskKey(balance.key) }}
            </p>
          </div>
          <span
            class="badge"
            :class="balance.error ? 'badge-error' : 'badge-success'"
          >
            {{ balance.platform || '未知' }}
          </span>
        </div>

        <!-- 错误信息 -->
        <div v-if="balance.error" class="p-3 bg-error/10 border border-error/20 rounded-default">
          <p class="text-sm text-error">{{ balance.error }}</p>
        </div>

        <!-- 余额信息 -->
        <div v-else class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">总额度</span>
            <span class="text-lg font-semibold text-text-primary">
              ${{ balance.total?.toFixed(2) || '0.00' }}
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">已使用</span>
            <span class="text-lg font-semibold text-accent">
              ${{ balance.used?.toFixed(2) || '0.00' }}
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">剩余额度</span>
            <span class="text-lg font-semibold text-success">
              ${{ balance.remaining?.toFixed(2) || '0.00' }}
            </span>
          </div>

          <!-- 使用率进度条 -->
          <div class="pt-2">
            <div class="flex justify-between text-xs text-text-secondary mb-1">
              <span>使用率</span>
              <span>{{ balance.usagePercent?.toFixed(1) || 0 }}%</span>
            </div>
            <div class="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="getProgressColor(balance.usagePercent)"
                :style="{ width: `${Math.min(balance.usagePercent || 0, 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- 访问权限截止时间 -->
          <div v-if="balance.expiresAt" class="pt-3 border-t border-border">
            <div class="flex items-center justify-between">
              <span class="text-xs text-text-secondary">访问截止</span>
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" :class="isExpired(balance.expiresAt) ? 'text-error' : isExpiringSoon(balance.expiresAt) ? 'text-orange-500' : 'text-text-secondary'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span
                  class="text-xs font-medium"
                  :class="isExpired(balance.expiresAt) ? 'text-error' : isExpiringSoon(balance.expiresAt) ? 'text-orange-500' : 'text-text-primary'"
                >
                  {{ formatDate(balance.expiresAt) }}
                </span>
              </div>
            </div>
            <p v-if="isExpired(balance.expiresAt)" class="text-xs text-error mt-1">
              ⚠️ 已过期
            </p>
            <p v-else-if="isExpiringSoon(balance.expiresAt)" class="text-xs text-orange-500 mt-1">
              ⚠️ 即将到期
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="card text-center py-12">
      <svg class="w-20 h-20 mx-auto mb-4 text-text-secondary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-text-secondary text-lg">暂无查询结果</p>
      <p class="text-text-secondary text-sm mt-2">请在上方输入 API 信息并点击查询</p>
    </div>
  </div>
</template>

<script setup>
import { maskApiKey } from '@/utils/formatters'

defineProps({
  balances: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['export'])

const maskKey = (key) => {
  return maskApiKey(key)
}

const getProgressColor = (percent) => {
  if (!percent) return 'bg-success'
  if (percent < 50) return 'bg-success'
  if (percent < 80) return 'bg-accent'
  return 'bg-error'
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isExpired = (timestamp) => {
  if (!timestamp) return false
  return Date.now() > timestamp * 1000
}

const isExpiringSoon = (timestamp) => {
  if (!timestamp) return false
  const now = Date.now()
  const expiryTime = timestamp * 1000
  const daysUntilExpiry = (expiryTime - now) / (1000 * 60 * 60 * 24)
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7 // 7天内到期
}
</script>
