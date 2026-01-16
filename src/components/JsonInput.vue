<template>
  <div class="flex flex-col h-full">
    <!-- Action Buttons -->
    <div class="flex gap-2 mb-3">
      <button
        v-if="modelValue"
        @click="clear"
        class="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Clear
      </button>
      <button
        v-if="canUnescape"
        @click="unescapeJson"
        class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1"
        title="Unescape JSON string"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Unescape
      </button>
      <div class="flex-1"></div>
      <div class="flex items-center gap-2 text-xs">
        <span v-if="error" class="text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </span>
        <span v-else-if="isValid" class="text-green-500 dark:text-green-400 font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Valid JSON
        </span>
        <span class="text-gray-500 dark:text-gray-400">
          {{ characterCount }} chars
        </span>
      </div>
    </div>

    <!-- Textarea -->
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="Paste or type your JSON here..."
      class="flex-1 w-full p-4 text-sm font-mono bg-white dark:bg-dark-surface border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
      :class="[
        error
          ? 'border-red-400 dark:border-red-500 text-red-900 dark:text-red-200'
          : 'border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200'
      ]"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  error?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const characterCount = computed(() => props.modelValue.length)

const isValid = computed(() => props.modelValue.trim() && !props.error)

const clear = () => {
  emit('update:modelValue', '')
}

// Check if the text can be unescaped (is an escaped JSON string)
const canUnescape = computed(() => {
  const trimmed = props.modelValue.trim()
  if (!trimmed || trimmed.length < 2) return false

  // Check if it's a JSON string (starts and ends with quotes)
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      // Try to parse it as JSON
      const parsed = JSON.parse(trimmed)
      // If it's a string, try to parse the inner content
      if (typeof parsed === 'string') {
        try {
          JSON.parse(parsed)
          return true
        } catch {
          // Not a valid JSON string inside
        }
      }
    } catch {
      // Not valid JSON
    }
  }

  return false
})

const unescapeJson = () => {
  try {
    const trimmed = props.modelValue.trim()
    const parsed = JSON.parse(trimmed)

    if (typeof parsed === 'string') {
      emit('update:modelValue', parsed)
    }
  } catch (e) {
    console.error('Failed to unescape JSON:', e)
  }
}
</script>
