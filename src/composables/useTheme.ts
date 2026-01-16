import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)
  const isLoaded = ref(false)

  onMounted(async () => {
    try {
      const result = await chrome.storage.sync.get('theme')
      isDark.value = result.theme === 'dark'
    } catch (e) {
      // Fallback to system preference if Chrome storage is not available
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } finally {
      isLoaded.value = true
      updateDocumentClass()
    }
  })

  const toggleTheme = async () => {
    isDark.value = !isDark.value
    try {
      await chrome.storage.sync.set({ theme: isDark.value ? 'dark' : 'light' })
    } catch (e) {
      console.warn('Chrome storage not available:', e)
    }
    updateDocumentClass()
  }

  const updateDocumentClass = () => {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, isLoaded, toggleTheme }
}
