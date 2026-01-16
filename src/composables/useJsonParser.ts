export function useJsonParser() {
  const parse = (text: string) => {
    if (!text.trim()) {
      return { data: null, error: null }
    }

    try {
      const json = JSON.parse(text)
      return { data: json, error: null }
    } catch (e) {
      const error = e as Error
      // Enhanced error messages
      let errorMessage = error.message

      // Add line number if available
      const match = error.message.match(/position (\d+)/)
      if (match) {
        const position = parseInt(match[1])
        const line = text.substring(0, position).split('\n').length
        const column = position - text.lastIndexOf('\n', position - 1)
        errorMessage = `Syntax error at line ${line}, column ${column}`
      }

      return { data: null, error: errorMessage }
    }
  }

  const format = (json: unknown, indent = 2) => {
    return JSON.stringify(json, null, indent)
  }

  const minify = (json: unknown) => {
    return JSON.stringify(json)
  }

  return { parse, format, minify }
}
