<template>
  <div class="font-mono text-sm">
    <!-- Primitive values -->
    <template v-if="isPrimitive">
      <span :class="getValueClass(data)">{{ formatValue(data) }}</span>
    </template>

    <!-- Objects -->
    <template v-else-if="isObjectData">
      <div v-for="(key, index) in keys" :key="key" class="select-none">
        <div class="flex items-start py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
          <!-- Expand/Collapse Button (only for complex types) -->
          <button
            v-if="isComplexValue((data as Record<string, unknown>)[key])"
            @click.stop="$emit('toggle', `${keyRef}.${key}`)"
            class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 h-3 transition-transform duration-150"
              :class="{ 'rotate-90': isNodeExpanded(`${keyRef}.${key}`) }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <span v-else class="w-6 mr-1"></span>

          <!-- Key -->
          <span class="text-json-key-light dark:text-json-key-dark">{{ formatKey(key) }}</span>
          <span class="mx-1 text-gray-400">:</span>

          <!-- Value: For primitives show inline, for complex show preview when collapsed -->
          <template v-if="isPrimitiveValue((data as Record<string, unknown>)[key])">
            <span class="ml-1" :class="getValueClass((data as Record<string, unknown>)[key])">{{ formatValue((data as Record<string, unknown>)[key]) }}</span>
          </template>
          <template v-else-if="!isNodeExpanded(`${keyRef}.${key}`)">
            <span class="text-gray-500" v-html="getValuePreview((data as Record<string, unknown>)[key])"></span>
          </template>
        </div>

        <!-- Nested content (when expanded, only for complex types) -->
        <div
          v-if="isComplexValue((data as Record<string, unknown>)[key])"
          v-show="isNodeExpanded(`${keyRef}.${key}`)"
          class="ml-6"
        >
          <TreeNode
            :data="(data as Record<string, unknown>)[key]"
            :key-ref="`${keyRef}.${key}`"
            :expanded-nodes-map="expandedNodesMap"
            @toggle="$emit('toggle', $event)"
          />
        </div>
      </div>
    </template>

    <!-- Arrays -->
    <template v-else-if="isArrayData">
      <div v-for="(item, index) in data" :key="index" class="select-none">
        <div class="flex items-start py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
          <!-- Expand/Collapse Button -->
          <button
            v-if="isObject(item) || isArray(item)"
            @click.stop="$emit('toggle', `${keyRef}[${index}]`)"
            class="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 h-3 transition-transform duration-150"
              :class="{ 'rotate-90': isNodeExpanded(`${keyRef}[${index}]`) }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <span v-else class="w-6 mr-1"></span>

          <!-- Array index -->
          <span class="text-gray-400">{{ index }}:</span>

          <!-- Value: For primitives show inline, for complex show preview when collapsed -->
          <template v-if="isPrimitiveValue(item)">
            <span class="ml-2" :class="getValueClass(item)">{{ formatValue(item) }}</span>
          </template>
          <template v-else-if="!isNodeExpanded(`${keyRef}[${index}]`)">
            <span class="ml-2 text-gray-500" v-html="getValuePreview(item)"></span>
          </template>
        </div>

        <!-- Nested content (when expanded) -->
        <div
          v-if="!isPrimitiveValue(item)"
          v-show="isNodeExpanded(`${keyRef}[${index}]`)"
          class="ml-6"
        >
          <TreeNode
            :data="item"
            :key-ref="`${keyRef}[${index}]`"
            :expanded-nodes-map="expandedNodesMap"
            @toggle="$emit('toggle', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: unknown
  keyRef: string
  expandedNodesMap: Record<string, boolean>
}>()

defineEmits<{
  toggle: [key: string]
}>()

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value)
}

const isPrimitive = computed(() => {
  const value = props.data
  return value === null || typeof value !== 'object'
})

const isObjectData = computed(() => {
  return isObject(props.data)
})

const isArrayData = computed(() => {
  return isArray(props.data)
})

const isPrimitiveValue = (value: unknown) => {
  return value === null || typeof value !== 'object'
}

const isComplexValue = (value: unknown) => {
  return typeof value === 'object' && value !== null
}

const keys = computed(() => {
  if (isObject(props.data)) {
    return Object.keys(props.data)
  }
  return []
})

const isNodeExpanded = (key: string) => {
  return !!props.expandedNodesMap[key]
}

const formatKey = (key: string) => {
  return `"${key}"`
}

const formatValue = (value: unknown): string => {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

const getValuePreview = (value: unknown): string => {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}" <span class="text-gray-400">(string)</span>`
  if (typeof value === 'number') return `${value} <span class="text-gray-400">(number)</span>`
  if (typeof value === 'boolean') return `${value} <span class="text-gray-400">(boolean)</span>`
  if (Array.isArray(value)) return `Array(${value.length})`
  if (typeof value === 'object') return `Object{...} <span class="text-gray-400">${Object.keys(value).length} keys</span>`
  return String(value)
}

const getValueClass = (value: unknown) => {
  if (typeof value === 'string') return 'text-json-string'
  if (typeof value === 'number') return 'text-json-number'
  if (typeof value === 'boolean') return 'text-json-boolean'
  if (value === null) return 'text-json-null'
  return ''
}
</script>
