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
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Expand All
      </button>
      <button
        v-if="json"
        @click="collapseAll"
        class="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-surface rounded hover:bg-gray-200 dark:hover:bg-dark-border transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
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
  if (expandedNodesMap.value[key]) {
    delete expandedNodesMap.value[key]
  } else {
    expandedNodesMap.value[key] = true
  }
  // Force re-render by incrementing key
  treeKey.value++
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
        const nodeKey = prefix ? `${prefix}.${key}` : key
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

// Auto-expand all nodes when JSON changes
watch(
  () => props.json,
  (newJson) => {
    if (newJson) {
      // Small delay to ensure component is ready
      nextTick(() => {
        expandAll()
      })
    } else {
      collapseAll()
    }
  },
  { immediate: true }
)
</script>
