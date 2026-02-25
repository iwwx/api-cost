<template>
  <Transition name="toast">
    <div
      class="min-w-[300px] max-w-md px-6 py-4 rounded-default shadow-lg"
      :class="typeClass"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 text-xl">{{ icon }}</div>
        <div class="flex-1">
          <p class="font-medium">{{ message }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="flex-shrink-0 text-white/80 hover:text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  }
})

defineEmits(['close'])

const typeClass = computed(() => {
  const classes = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-white',
    info: 'bg-accent text-white'
  }
  return classes[props.type]
})

const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[props.type]
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
