<template>
  <div class="flex flex-col h-full">
    <!-- Action Buttons -->
    <div class="flex gap-2 mb-3">
      <button
        v-if="json"
        @click="copyToClipboard"
        class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-surface rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
        {{ copyLabel }}
      </button>
      <button
        v-if="json"
        @click="toggleFormat"
        class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-surface rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
        {{ minified ? 'Format' : 'Minify' }}
      </button>
      <div class="flex-1"></div>
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span v-if="json">
          {{ jsonTypeLabel }}
          <span v-if="Array.isArray(json)">({{ json.length }} items)</span>
          <span v-else-if="typeof json === 'object' && json !== null">({{ Object.keys(json).length }} keys)</span>
        </span>
      </div>
    </div>

    <!-- Output Area -->
    <div class="flex-1 overflow-auto bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-lg p-4">
      <template v-if="json">
        <!-- Formatted View -->
        <pre v-if="!minified" class="text-sm font-mono whitespace-pre-wrap break-words"><SyntaxHighlighter :data="json" /></pre>
        <!-- Minified View -->
        <code v-else class="text-sm font-mono whitespace-pre-wrap break-words text-json-string">{{ minifiedJson }}</code>
      </template>
      <template v-else>
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
          <span v-if="error">{{ error }}</span>
          <span v-else>No JSON to display</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SyntaxHighlighter from './SyntaxHighlighter.vue'

const props = defineProps<{
  json: unknown
  error?: string | null
}>()

const minified = ref(false)
const copyLabel = ref('Copy')
const minifiedJson = computed(() => {
  if (!props.json) return ''
  return JSON.stringify(props.json)
})

const jsonTypeLabel = computed(() => {
  if (Array.isArray(props.json)) return 'Array'
  if (props.json === null) return 'null'
  return typeof props.json
})

const copyToClipboard = async () => {
  try {
    const text = minified.value ? minifiedJson.value : JSON.stringify(props.json, null, 2)
    await navigator.clipboard.writeText(text)
    copyLabel.value = 'Copied!'
    setTimeout(() => {
      copyLabel.value = 'Copy'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const toggleFormat = () => {
  minified.value = !minified.value
}

// Reset minified view when JSON changes
watch(
  () => props.json,
  () => {
    minified.value = false
  }
)
</script>
