<template>
  <div class="flex flex-col h-full">
    <!-- Action Buttons -->
    <div class="flex gap-2 mb-3">
      <button
        v-if="json"
        @click="expandAll"
        class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-surface rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Expand All
      </button>
      <button
        v-if="json"
        @click="collapseAll"
        class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-surface rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0-4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
        Collapse All
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

    <!-- Tree View Area -->
    <div class="flex-1 overflow-auto bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-dark-border rounded-lg p-4">
      <template v-if="json">
        <TreeNode :key="treeKey" :data="json" :key-ref="''" :expanded-nodes-map="expandedNodesMap" @toggle="toggleNode" />
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
import { ref, computed, watch, nextTick } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps<{
  json: unknown
  error?: string | null
}>()

// Use a version counter to force re-renders
const treeKey = ref(0)
const expandedNodesMap = ref<Record<string, boolean>>({})

const jsonTypeLabel = computed(() => {
  if (Array.isArray(props.json)) return 'Array'
  if (props.json === null) return 'null'
  return typeof props.json
})

const toggleNode = (key: string) => {
  expandedNodesMap.value[key] = !expandedNodesMap.value[key]
}

const expandAll = () => {
  const nodes: Record<string, boolean> = {}
  const addAllNodes = (obj: unknown, prefix = '') => {
    if (!obj || typeof obj !== 'object') return

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const nodeKey = `${prefix}[${index}]`
        nodes[nodeKey] = true
        if (item && typeof item === 'object') {
          addAllNodes(item, nodeKey)
        }
      })
    } else {
      Object.keys(obj).forEach(key => {
        const nodeKey = `${prefix}.${key}`
        nodes[nodeKey] = true
        const value = (obj as Record<string, unknown>)[key]
        if (value && typeof value === 'object') {
          addAllNodes(value, nodeKey)
        }
      })
    }
  }
  addAllNodes(props.json)
  expandedNodesMap.value = nodes
  // Force re-render by incrementing key
  treeKey.value++
}

const collapseAll = () => {
  expandedNodesMap.value = {}
  treeKey.value++
}

// Auto-expand all nodes when JSON first loads
let isInitialLoad = true
watch(
  () => props.json,
  (newJson, oldJson) => {
    // Only auto-expand on initial load or when JSON changes from null/undefined
    if (newJson && (isInitialLoad || !oldJson)) {
      isInitialLoad = false
      // Small delay to ensure component is ready
      nextTick(() => {
        expandAll()
      })
    } else if (!newJson) {
      collapseAll()
    }
  },
  { immediate: true }
)
</script>
