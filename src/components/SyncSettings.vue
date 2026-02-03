<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('update:modelValue', false)">
    <div class="card max-w-md w-full">
      <h3 class="text-xl font-semibold mb-4">云端同步设置</h3>

      <!-- 开关 -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm">启用云端同步</span>
        <label class="relative inline-block w-12 h-6">
          <input type="checkbox" :checked="enabled" @change="$emit('toggle', $event.target.checked)" class="sr-only peer">
          <div class="w-12 h-6 bg-border rounded-full peer peer-checked:bg-accent transition-colors"></div>
          <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
        </label>
      </div>

      <!-- 同步码 -->
      <div class="mb-4">
        <label class="text-sm font-medium mb-2 block">同步码 (可选)</label>
        <input
          v-model="syncCode"
          type="text"
          placeholder="输入自定义同步码以跨设备同步"
          class="input-field text-sm"
        >
        <p class="text-xs text-text-secondary mt-1">
          在其他设备输入相同的同步码即可同步数据
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2">
        <button @click="$emit('update:modelValue', false)" class="btn-secondary flex-1">
          关闭
        </button>
        <button @click="handleSave" class="btn-primary flex-1">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { setCustomSyncCode } from '@/utils/deviceId'

const props = defineProps({
  modelValue: Boolean,
  enabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'toggle', 'save'])

const syncCode = ref('')

const handleSave = () => {
  if (syncCode.value && syncCode.value.length >= 8) {
    setCustomSyncCode(syncCode.value)
  }
  emit('save')
  emit('update:modelValue', false)
}
</script>
