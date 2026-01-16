<template>
  <div class="w-screen h-screen bg-white dark:bg-dark-bg transition-colors duration-200">
    <!-- Header -->
    <header class="flex flex-col border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg">
      <!-- Title and Theme Toggle -->
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <!-- Ninja Star Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
          </svg>
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">
            Json<span class="text-blue-600 dark:text-blue-400">Ninja</span>
          </h1>
        </div>
        <ThemeToggle />
      </div>

      <!-- Tabs -->
      <div class="flex px-4 gap-1">
        <button
          @click="activeTab = 'input'"
          class="px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
          :class="[
            activeTab === 'input'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Input
        </button>
        <button
          @click="activeTab = 'formatted'"
          class="px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
          :class="[
            activeTab === 'formatted'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
          </svg>
          Formatted
        </button>
        <button
          @click="activeTab = 'tree'"
          class="px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
          :class="[
            activeTab === 'tree'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Tree View
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="h-[calc(100vh-100px)] overflow-hidden">
      <div class="h-full p-4 overflow-hidden">
        <!-- Input Tab -->
        <div v-if="activeTab === 'input'" class="h-full">
          <JsonInput v-model="inputText" :error="parseError" />
        </div>

        <!-- Formatted Tab -->
        <div v-else-if="activeTab === 'formatted'" class="h-full">
          <JsonOutput :json="parsedJson" :error="parseError" />
        </div>

        <!-- Tree View Tab -->
        <div v-else-if="activeTab === 'tree'" class="h-full">
          <JsonTreeView :json="parsedJson" :error="parseError" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useJsonParser } from './composables/useJsonParser'
import JsonInput from './components/JsonInput.vue'
import JsonOutput from './components/JsonOutput.vue'
import JsonTreeView from './components/JsonTreeView.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const STORAGE_KEY = 'jsonNinja_inputText'
const TAB_STORAGE_KEY = 'jsonNinja_activeTab'

const activeTab = ref<'input' | 'formatted' | 'tree'>('input')
const inputText = ref('')
const parseError = ref<string | null>(null)
const parsedJson = ref<unknown>(null)

const { parse } = useJsonParser()

// Load saved data on mount
onMounted(() => {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY)
    if (savedText) {
      inputText.value = savedText
    }
    
    const savedTab = localStorage.getItem(TAB_STORAGE_KEY) as 'input' | 'formatted' | 'tree' | null
    if (savedTab && ['input', 'formatted', 'tree'].includes(savedTab)) {
      activeTab.value = savedTab
    }
  } catch (error) {
    console.error('Failed to load saved data:', error)
  }
})

// Save input text to localStorage
watch(inputText, (newValue) => {
  try {
    localStorage.setItem(STORAGE_KEY, newValue)
  } catch (error) {
    console.error('Failed to save input text:', error)
  }
})

// Save active tab to localStorage
watch(activeTab, (newValue) => {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, newValue)
  } catch (error) {
    console.error('Failed to save active tab:', error)
  }
})

// Parse JSON on input change with debounce
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(inputText, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    const result = parse(newValue)
    parsedJson.value = result.data
    parseError.value = result.error
  }, 300)
}, { immediate: true })
</script>
