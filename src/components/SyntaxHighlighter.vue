<template>
  <span :class="getValueClass(data)">
    <!-- Object -->
    <template v-if="isObject">
      <span class="text-json-brace dark:text-json-brace">{</span>
      <template v-if="keys.length > 0">
        <div v-for="(key, index) in keys" :key="key" class="ml-4">
          <span class="text-json-key-light dark:text-json-key-dark" v-html="highlightText(`&quot;${key}&quot;`)"></span
          ><span class="text-json-brace dark:text-json-brace">:</span>
          <span class="ml-1">
            <SyntaxHighlighter :data="(data as Record<string, unknown>)[key]" :search-query="searchQuery" />
          </span>
          <span v-if="index < keys.length - 1" class="text-json-brace dark:text-json-brace">,</span>
        </div>
      </template>
      <span class="text-json-brace dark:text-json-brace">}</span>
    </template>

    <!-- Array -->
    <template v-else-if="isArray">
      <span class="text-json-brace dark:text-json-brace">[</span>
      <template v-if="(data as unknown[]).length > 0">
        <div v-for="(item, index) in data" :key="index" class="ml-4">
          <SyntaxHighlighter :data="item" :search-query="searchQuery" />
          <span v-if="index < (data as unknown[]).length - 1" class="text-json-brace dark:text-json-brace"
            >,</span
          >
        </div>
      </template>
      <span class="text-json-brace dark:text-json-brace">]</span>
    </template>

    <!-- String -->
    <template v-else-if="isString">
      <span class="text-json-string" v-html="highlightText(`&quot;${escapeHtml(String(data))}&quot;`)"></span>
    </template>

    <!-- Number -->
    <template v-else-if="isNumber">
      <span class="text-json-number" v-html="highlightText(String(data))"></span>
    </template>

    <!-- Boolean -->
    <template v-else-if="isBoolean">
      <span class="text-json-boolean" v-html="highlightText(String(data))"></span>
    </template>

    <!-- Null -->
    <template v-else>
      <span class="text-json-null" v-html="highlightText('null')"></span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: unknown
  searchQuery?: string
}>()

const isObject = computed(() => typeof props.data === 'object' && props.data !== null && !Array.isArray(props.data))
const isArray = computed(() => Array.isArray(props.data))
const isString = computed(() => typeof props.data === 'string')
const isNumber = computed(() => typeof props.data === 'number')
const isBoolean = computed(() => typeof props.data === 'boolean')

const keys = computed(() => {
  if (isObject.value) {
    return Object.keys(props.data as Record<string, unknown>)
  }
  return []
})

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const highlightText = (text: string): string => {
  if (!props.searchQuery || props.searchQuery.trim() === '') {
    return text
  }
  
  const escapedQuery = props.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escapedQuery, 'gi')
  return text.replace(regex, (match) => {
    return `<mark class="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 rounded px-0.5">${match}</mark>`
  })
}

const getValueClass = (value: unknown) => {
  return ''
}
</script>
