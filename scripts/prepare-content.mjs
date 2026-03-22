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

import { existsSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const JOURNAL_DIR = join(ROOT, 'journal')
const TARGET_DIR = join(ROOT, 'src', 'app', 'journal')

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
 * Copy entry subdirectories from journal/ into src/app/journal/
 */
function copyEntries() {
  if (!existsSync(JOURNAL_DIR)) {
    return 0
  }

  const entries = readdirSync(JOURNAL_DIR)
  let count = 0

  for (const entry of entries) {
    const sourcePath = join(JOURNAL_DIR, entry)
    if (!statSync(sourcePath).isDirectory()) continue

    const targetPath = join(TARGET_DIR, entry)
    cpSync(sourcePath, targetPath, { recursive: true })
    count++
  }

  return count
}

// --- Main ---

console.log('📄 Preparing journal content from journal/...\n')

if (!existsSync(JOURNAL_DIR)) {
  console.log('⚠  journal/ directory not found.')
  console.log('   Copy entries from journal-examples/ to journal/ to get started.\n')
  process.exit(0)
}

cleanTarget()

const count = copyEntries()
console.log(`   → ${count} entries copied`)

console.log(`\n✅ Done! ${count} journal entries prepared.\n`)
