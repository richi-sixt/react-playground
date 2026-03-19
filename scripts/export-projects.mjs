/**
 * Export all app metadata as JSON for consumption by other projects
 * (e.g., digital-handshake can display project cards with links back here).
 *
 * Run: node scripts/export-projects.mjs
 * Output: public/api/projects.json
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const appsDir = path.join(rootDir, 'src/app/apps')
const outputDir = path.join(rootDir, 'public/api')
const outputFile = path.join(outputDir, 'projects.json')

async function extractApps() {
  const entries = fs.readdirSync(appsDir, { withFileTypes: true })
  const apps = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const mdxPath = path.join(appsDir, entry.name, 'page.en.mdx')
    if (!fs.existsSync(mdxPath)) continue

    const content = fs.readFileSync(mdxPath, 'utf-8')

    // Extract the exported app object from MDX frontmatter
    const match = content.match(/export\s+const\s+app\s*=\s*(\{[\s\S]*?\n\})/)
    if (!match) continue

    try {
      // Use Function constructor to safely evaluate the object literal
      const app = new Function(`return ${match[1]}`)()
      apps.push({ slug: entry.name, ...app })
    } catch (e) {
      console.warn(`Warning: Could not parse app metadata from ${entry.name}:`, e.message)
    }
  }

  return apps.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

const apps = await extractApps()

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(apps, null, 2))

console.log(`Exported ${apps.length} projects to ${outputFile}`)
