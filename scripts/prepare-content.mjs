#!/usr/bin/env node

/**
 * prepare-content.mjs
 *
 * Copies journal entries from journal/ into src/app/journal/ before build/dev.
 *
 * The journal/ directory is the single source of truth.
 * Use journal-examples/ as a reference to create your own entries.
 *
 * Usage:
 *   node scripts/prepare-content.mjs
 */

import { existsSync, cpSync, rmSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const JOURNAL_DIR = join(ROOT, 'journal')
const TARGET_DIR = join(ROOT, 'src', 'app', 'journal')
const PUBLIC_JOURNAL_DIR = join(ROOT, 'public', 'journal')

/** File extensions that are treated as journal entry pages. */
const PAGE_EXTENSIONS = new Set(['.mdx', '.md', '.tsx', '.ts', '.jsx', '.js'])

/**
 * Remove all content subdirectories from src/app/journal/
 * but preserve top-level files (page.tsx, etc.)
 */
function cleanTarget() {
  if (!existsSync(TARGET_DIR)) return

  const entries = readdirSync(TARGET_DIR)
  for (const entry of entries) {
    const fullPath = join(TARGET_DIR, entry)
    if (statSync(fullPath).isDirectory()) {
      rmSync(fullPath, { recursive: true, force: true })
    }
  }
}

/**
 * Check whether a directory looks like a journal entry (contains page files)
 * vs. a static asset directory (screenshots, images, etc.)
 */
function isEntryDirectory(dirPath) {
  const files = readdirSync(dirPath)
  return files.some((f) => {
    const ext = f.slice(f.lastIndexOf('.'))
    return PAGE_EXTENSIONS.has(ext)
  })
}

/**
 * Copy entry subdirectories from journal/ into src/app/journal/
 * and copy asset directories into public/journal/ for static serving.
 */
function copyEntries() {
  if (!existsSync(JOURNAL_DIR)) {
    return { entries: 0, assets: 0 }
  }

  const items = readdirSync(JOURNAL_DIR)
  let entries = 0
  let assets = 0

  for (const item of items) {
    const sourcePath = join(JOURNAL_DIR, item)
    if (!statSync(sourcePath).isDirectory()) continue

    if (isEntryDirectory(sourcePath)) {
      // Journal entry → copy to src/app/journal/ for Next.js routing
      const targetPath = join(TARGET_DIR, item)
      cpSync(sourcePath, targetPath, { recursive: true })
      entries++
    } else {
      // Asset directory (screenshots, images, etc.) → copy to public/journal/
      const publicPath = join(PUBLIC_JOURNAL_DIR, item)
      mkdirSync(publicPath, { recursive: true })
      cpSync(sourcePath, publicPath, { recursive: true })
      assets++
    }
  }

  return { entries, assets }
}

// --- Main ---

console.log('📄 Preparing journal content from journal/...\n')

if (!existsSync(JOURNAL_DIR)) {
  console.log('⚠  journal/ directory not found.')
  console.log('   Copy entries from journal-examples/ to journal/ to get started.\n')
  process.exit(0)
}

cleanTarget()

const { entries, assets } = copyEntries()
console.log(`   → ${entries} entries copied`)
if (assets > 0) {
  console.log(`   → ${assets} asset folders copied to public/journal/`)
}

console.log(`\n✅ Done! ${entries} journal entries prepared.\n`)
