/**
 * Icon Generation Script
 *
 * This script converts the SVG icon to PNG files in all required sizes for the Chrome extension.
 *
 * Prerequisites:
 *   npm install sharp
 *
 * Usage:
 *   npm run generate-icons
 *   or
 *   node scripts/generate-icons.js
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [16, 32, 48, 128, 512]
const svgPath = path.join(__dirname, '../public/icons/icon.svg')
const iconsDir = path.join(__dirname, '../public/icons')

async function generateIcons() {
  console.log('Generating icons...')

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
  }

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error(`SVG file not found at ${svgPath}`)
    process.exit(1)
  }

  // Generate PNG for each size
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}.png`)

    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath)

      console.log(`✓ Generated icon-${size}.png`)
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}.png:`, error.message)
    }
  }

  console.log('\nIcon generation complete!')
}

generateIcons().catch(console.error)
