# JsonNinja 🥷

A powerful Chrome extension for parsing and formatting JSON with syntax highlighting and tree view visualization.

![JsonNinja Icon](public/icons/icon-128.png)

## Features

- **📧 Input Tab** - Paste or type raw JSON text with real-time validation
- **📄 Formatted Tab** - View beautifully formatted JSON with syntax highlighting and search
- **🌳 Tree View Tab** - Interactive collapsible tree structure for exploring JSON
- **🌓 Dark Mode** - Toggle between light and dark themes
- **📋 One-Click Copy** - Copy formatted or minified JSON to clipboard
- **🔍 Unescape Support** - Automatically detects and unescapes escaped JSON strings
- **✅ Real-time Validation** - Get instant feedback with error messages and line numbers
- **🔎 Search & Highlight** - Search and highlight text across formatted JSON
- **💾 Auto-Save** - Automatically saves your JSON data and preferences
- **🎯 Smart Tree View** - Primitive values shown inline, complex structures expandable

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **Chrome Manifest V3** - Latest Chrome extension API

## Installation

### From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "JsonNinja"
3. Click "Add to Chrome"

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/rzvpopescu/JsonNinja.git
   cd JsonNinja
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Generate icons
npm run generate-icons
```

## Usage

1. Click the JsonNinja extension icon in your Chrome toolbar
2. Paste your JSON in the **Input** tab
3. Switch to **Formatted** tab to see syntax-highlighted JSON
4. Or switch to **Tree View** tab for an interactive collapsible tree

### Features in Detail

#### Input Tab
- **Clear** button - Clear the input
- **Unescape** button - Unescape escaped JSON strings (auto-detects)
- Real-time validation with character count
- Persistent storage - your JSON is automatically saved

#### Formatted Tab
- **Copy** button - Copy formatted JSON
- **Minify/Format** toggle - Switch between formatted and compact view
- **Search** - Find and highlight text in JSON with match counter
- Syntax highlighting for strings, numbers, booleans, null, and keys
- Real-time search highlighting in both formatted and minified views

#### Tree View Tab
- **Expand All** - Expand all branches
- **Collapse All** - Collapse all branches
- Click arrows to expand/collapse individual nodes
- Primitive values (strings, numbers, booleans, null) displayed inline
- Complex structures (objects, arrays) expandable with preview when collapsed
- Color-coded values
- Auto-expand on initial JSON load

## Icon Design

The JsonNinja icon features a stylized ninja throwing star (shuriken) with JSON syntax elements:
- 4 points containing `{ } [ ]` brackets
- Center with `:` and `"` for JSON key-value syntax
- Green accents representing JSON strings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Author

**Razvan Popescu**
- GitHub: [@rzvpopescu](https://github.com/rzvpopescu)

## Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- Icons from [Heroicons](https://heroicons.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
