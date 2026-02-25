<template>
  <div class="card space-y-6">
    <!-- 标题和同步状态 -->
    <div class="flex items-center gap-3">
      <h2 class="text-2xl font-semibold text-text-primary">API 配置</h2>

      <!-- 同步状态指示器 -->
      <div class="flex items-center gap-1.5 text-xs">
        <svg
          v-if="presetLoading"
          class="w-4 h-4 text-accent animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span :class="presetLoading ? 'text-accent' : 'text-success'">
          {{ presetLoading ? '加载中...' : 'KV 云存储' }}
        </span>
      </div>
    </div>

    <!-- 智能粘贴识别区域 -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg p-4 space-y-3">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-blue-900">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          一键智能识别
        </label>
        <button
          v-if="pasteText"
          @click="clearPaste"
          class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          清空
        </button>
      </div>
      <textarea
        v-model="pasteText"
        placeholder="粘贴包含 API 信息的文本,自动识别 URL 和 Key&#x0A;例如: Base URL: https://api.example.com&#x0A;      Key: sk-xxxxxxxx"
        rows="3"
        class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono resize-none"
        @input="handlePasteInput"
      ></textarea>
      <div v-if="parsePreview" class="bg-white rounded-lg p-3 border border-blue-200">
        <div class="text-xs font-medium text-blue-800 mb-2">识别结果:</div>
        <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ parsePreview }}</pre>
        <button
          @click="applyParsedData"
          class="mt-3 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          应用到下方表单
        </button>
      </div>
    </div>

    <!-- API 平台预设 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-text-primary">
          快速选择平台
        </label>
        <button
          v-if="Object.keys(presetStorage.builtInOverrides).length > 0"
          @click="restoreDefaults"
          class="text-accent hover:underline text-xs"
        >
          恢复默认预设
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <!-- 现有预设 -->
        <div
          v-for="preset in presets"
          :key="preset.id"
          class="group relative p-4 bg-white border-2 border-border rounded-default hover:border-accent text-left transition-all"
        >
          <!-- 点击区域: 填充 URL -->
          <button @click="selectPreset(preset)" class="w-full text-left">
            <div class="font-medium text-text-primary mb-1">{{ preset.name }}</div>
            <div class="text-xs text-text-secondary font-mono truncate">{{ preset.url }}</div>
          </button>

          <!-- 操作按钮 (hover 显示) -->
          <div class="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="openEditDialog(preset)"
              class="p-1.5 bg-white rounded hover:bg-accent hover:text-white transition-colors shadow-sm"
              title="编辑"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click.stop="deletePreset(preset)"
              class="p-1.5 bg-white rounded hover:bg-error hover:text-white transition-colors shadow-sm"
              title="删除"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- "+"新增按钮 -->
        <button
          @click="openCreateDialog"
          class="p-4 bg-white border-2 border-dashed border-border rounded-default hover:border-accent hover:bg-bg-secondary transition-all text-center"
        >
          <svg class="w-8 h-8 mx-auto mb-2 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm text-text-secondary">添加自定义平台</span>
        </button>
      </div>
    </div>

    <!-- API 配置区域 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-text-primary">
          API 配置
        </label>
        <button
          v-if="apiHistory.length > 0"
          @click="showApiHistory = true"
          class="text-accent hover:underline text-xs flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          历史记录 ({{ apiHistory.length }})
        </button>
      </div>

      <!-- API URL 输入 -->
      <div class="mb-4">
        <label class="block text-xs text-text-secondary mb-1">API 地址</label>
        <input
          v-model="apiUrl"
          type="url"
          placeholder="https://api.openai.com"
          class="input-field"
          :class="{ 'border-error': urlError, 'border-orange-400': !urlError && urlWarning }"
          @blur="validateUrl"
        />
        <p v-if="urlError" class="mt-2 text-sm text-error">{{ urlError }}</p>
        <p v-else-if="urlWarning" class="mt-2 text-sm text-orange-600">
          ⚠️ {{ urlWarning }}
        </p>
      </div>

      <!-- API Key 输入 -->
      <div>
        <label class="block text-xs text-text-secondary mb-1">API Key (每行一个,支持批量)</label>
        <div class="relative">
          <textarea
            v-model="apiKeys"
            placeholder="sk-proj-..."
            rows="4"
            class="input-field font-mono text-sm"
            :class="{ 'border-error': keyError, 'mask-text': !showKeys }"
            @blur="validateKeys"
          ></textarea>
          <button
            @click="showKeys = !showKeys"
            class="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
          >
            <svg v-if="showKeys" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="keyError" class="mt-2 text-sm text-error">{{ keyError }}</p>
        <p v-else-if="keyWarning" class="mt-2 text-sm text-orange-600">
          ⚠️ {{ keyWarning }}
        </p>
        <p v-else class="mt-2 text-xs text-text-secondary">
          检测到 {{ keyCount }} 个密钥
        </p>
      </div>
    </div>

    <!-- 查询按钮 -->
    <button
      @click="handleQuery"
      :disabled="loading || !isValid"
      class="btn-primary w-full flex items-center justify-center gap-2"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span>{{ loading ? '查询中...' : '查询余额与模型' }}</span>
    </button>

    <!-- API 配置历史记录对话框 -->
    <ApiHistoryDialog
      v-model="showApiHistory"
      :items="apiHistory"
      @select="selectHistoryItem"
      @remove="removeHistoryItem"
      @clear="clearAllHistory"
    />

    <!-- 预设管理对话框 -->
    <PresetDialog
      v-model="showPresetDialog"
      :mode="presetDialogMode"
      :initial-data="editingPreset"
      :existing-names="existingPresetNames"
      @save="savePreset"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ApiHistoryDialog from './ApiHistoryDialog.vue'
import PresetDialog from './PresetDialog.vue'
import { validateApiUrl, validateApiKey } from '@/utils/validators'
import { parseApiInfo, formatParseResult } from '@/utils/smartParse'
import { useKVStorage } from '@/composables/useKVStorage'

const emit = defineEmits(['query'])

// 智能粘贴识别
const pasteText = ref('')
const parsedData = ref(null)
const parsePreview = ref('')

// 内置预设常量
const BUILT_IN_PRESETS = [
  { name: 'OpenAI 官方', url: 'https://api.openai.com' },
  { name: '硅基流动', url: 'https://api.siliconflow.cn' },
  { name: 'DeepSeek', url: 'https://api.deepseek.com' },
  { name: 'Cloudflare AI', url: 'https://api.cloudflare.com/client/v4/accounts' },
  { name: '月之暗面', url: 'https://api.moonshot.cn' },
  { name: '智谱AI', url: 'https://open.bigmodel.cn' },
]

// 预设持久化存储 (KV 优先)
const {
  value: presetStorage,
  loading: presetLoading
} = useKVStorage('platform-presets', {
  custom: [],
  builtInOverrides: {}
})

// 对话框状态
const showPresetDialog = ref(false)
const presetDialogMode = ref('create')
const editingPreset = ref(null)

// 计算属性: 合并后的预设列表
const presets = computed(() => {
  // 处理内置预设 (应用 override)
  const processedBuiltIn = BUILT_IN_PRESETS
    .filter(p => !presetStorage.value.builtInOverrides[p.name]?.deleted)
    .map(p => ({
      id: `builtin-${p.name}`,
      ...p,
      ...(presetStorage.value.builtInOverrides[p.name] || {}),
      isBuiltIn: true
    }))

  // 合并自定义预设
  return [...processedBuiltIn, ...presetStorage.value.custom]
})

// 获取所有现有预设名称
const existingPresetNames = computed(() => {
  return presets.value.map(p => p.name)
})

// 表单数据
const apiUrl = ref('')
const apiKeys = ref('')
const showKeys = ref(false)
const loading = ref(false)

// 验证错误和警告
const urlError = ref('')
const urlWarning = ref('')
const keyError = ref('')
const keyWarning = ref('')

// 历史记录 (KV 优先) - 整合 URL 和 Key
const { value: apiHistory, push: pushHistory, remove: removeHistory, clear: clearHistory } = useKVStorage('api-history', [])

const showApiHistory = ref(false)

// 计算属性
const keyCount = computed(() => {
  return apiKeys.value.split('\n').filter(k => k.trim()).length
})

const isValid = computed(() => {
  return !urlError.value && !keyError.value && apiUrl.value && apiKeys.value
})

// 方法
const selectPreset = (preset) => {
  apiUrl.value = preset.url
  urlError.value = ''
  urlWarning.value = ''
}

const validateUrl = () => {
  const result = validateApiUrl(apiUrl.value)
  urlError.value = result.error || ''
  urlWarning.value = result.warning || ''
}

const validateKeys = () => {
  const keys = apiKeys.value.split('\n').filter(k => k.trim())
  if (keys.length === 0) {
    keyError.value = '请至少输入一个 API Key'
    keyWarning.value = ''
    return
  }

  // 检查所有密钥
  let hasWarning = false
  for (const key of keys) {
    const result = validateApiKey(key)
    if (result.error) {
      keyError.value = `密钥格式错误: ${result.error}`
      keyWarning.value = ''
      return
    }
    if (result.warning) {
      hasWarning = true
    }
  }

  keyError.value = ''
  // 如果有警告,显示警告信息
  if (hasWarning) {
    keyWarning.value = '该 API Key 格式不是 sk- 或 Bearer 开头,请注意是否输入错误'
  } else {
    keyWarning.value = ''
  }
}

const handleQuery = () => {
  validateUrl()
  validateKeys()

  if (!isValid.value) return

  // 保存到历史记录 (整合 URL 和 Key)
  const historyItem = {
    url: apiUrl.value,
    keys: apiKeys.value.split('\n').filter(k => k.trim()),
    lastUsed: Date.now()
  }

  // 检查是否已存在相同的 URL
  const existingIndex = apiHistory.value.findIndex(item => item.url === apiUrl.value)
  if (existingIndex !== -1) {
    // 更新现有记录
    apiHistory.value.splice(existingIndex, 1)
  }

  // 添加到历史记录开头
  apiHistory.value.unshift(historyItem)

  // 限制历史记录数量 (最多 20 条)
  if (apiHistory.value.length > 20) {
    apiHistory.value = apiHistory.value.slice(0, 20)
  }

  loading.value = true
  const normalize = u => u.replace(/\/+$/, '')
  const matchedPreset = presets.value.find(p => normalize(p.url) === normalize(apiUrl.value))
  const platform = matchedPreset
    ? matchedPreset.name
    : (() => { try { return new URL(apiUrl.value).hostname } catch { return apiUrl.value } })()

  emit('query', {
    url: apiUrl.value,
    keys: apiKeys.value.split('\n').filter(k => k.trim()),
    platform
  })
}

// 历史记录操作
const selectHistoryItem = (item) => {
  apiUrl.value = item.url
  apiKeys.value = item.keys.join('\n')
  urlError.value = ''
  urlWarning.value = ''
  keyError.value = ''
  keyWarning.value = ''
  showApiHistory.value = false
}

const removeHistoryItem = (index) => {
  removeHistory(index)
}

const clearAllHistory = () => {
  clearHistory()
  showApiHistory.value = false
}

// 预设管理方法
const openCreateDialog = () => {
  presetDialogMode.value = 'create'
  editingPreset.value = null
  showPresetDialog.value = true
}

const openEditDialog = (preset) => {
  presetDialogMode.value = 'edit'
  editingPreset.value = preset
  showPresetDialog.value = true
}

const savePreset = ({ name, url }) => {
  if (presetDialogMode.value === 'create') {
    // 新增自定义预设
    const newPreset = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      url,
      isBuiltIn: false
    }
    presetStorage.value.custom.push(newPreset)
  } else {
    // 编辑预设
    if (editingPreset.value.isBuiltIn) {
      // 编辑内置预设 → 记录到 override
      const originalName = editingPreset.value.id.replace('builtin-', '')
      presetStorage.value.builtInOverrides[originalName] = { name, url }
    } else {
      // 编辑自定义预设 → 直接修改
      const index = presetStorage.value.custom.findIndex(p => p.id === editingPreset.value.id)
      if (index !== -1) {
        presetStorage.value.custom[index] = { ...editingPreset.value, name, url }
      }
    }
  }
  showPresetDialog.value = false
}

const deletePreset = (preset) => {
  if (!confirm(`确定要删除预设 "${preset.name}" 吗?`)) return

  if (preset.isBuiltIn) {
    // 标记内置预设为已删除
    const originalName = preset.id.replace('builtin-', '')
    if (!presetStorage.value.builtInOverrides[originalName]) {
      presetStorage.value.builtInOverrides[originalName] = {}
    }
    presetStorage.value.builtInOverrides[originalName].deleted = true
  } else {
    // 删除自定义预设
    const index = presetStorage.value.custom.findIndex(p => p.id === preset.id)
    if (index !== -1) {
      presetStorage.value.custom.splice(index, 1)
    }
  }
}

const restoreDefaults = () => {
  if (!confirm('确定要恢复默认预设吗?\n这将清除所有对内置预设的修改,但保留自定义预设。')) {
    return
  }
  presetStorage.value.builtInOverrides = {}
}

// 智能粘贴识别方法
const handlePasteInput = () => {
  if (!pasteText.value.trim()) {
    parsedData.value = null
    parsePreview.value = ''
    return
  }

  // 解析粘贴的文本
  const result = parseApiInfo(pasteText.value)
  parsedData.value = result

  // 生成预览
  if (result.url || result.keys.length > 0) {
    parsePreview.value = formatParseResult(result)
  } else {
    parsePreview.value = '未识别到有效的 API 地址或密钥'
  }
}

const applyParsedData = () => {
  if (!parsedData.value) return

  // 应用 URL
  if (parsedData.value.url) {
    apiUrl.value = parsedData.value.url
    urlError.value = ''
    urlWarning.value = ''
  }

  // 应用 Keys
  if (parsedData.value.keys && parsedData.value.keys.length > 0) {
    apiKeys.value = parsedData.value.keys.join('\n')
    keyError.value = ''
    keyWarning.value = ''
  }

  // 清空粘贴框
  pasteText.value = ''
  parsedData.value = null
  parsePreview.value = ''
}

const clearPaste = () => {
  pasteText.value = ''
  parsedData.value = null
  parsePreview.value = ''
}

// 暴露方法给父组件
defineExpose({
  setLoading: (value) => { loading.value = value }
})
</script>

<style scoped>
.mask-text {
  color: transparent;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
</style>
