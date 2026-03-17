#!/usr/bin/env node

/**
 * prepare-content.mjs
 *
 * Copies journal entries into src/app/journal/ before build/dev.
 *
 * Sources (both are merged):
 *   1. journal-examples/ → example entries (tracked in git)
 *   2. journal/          → real entries (gitignored)
 *
 * In git, only journal-examples/ is tracked. During build, both
 * sources are combined so all entries appear on the site.
 *
 * Usage:
 *   node scripts/prepare-content.mjs             # merge both sources
 *   node scripts/prepare-content.mjs --examples  # only use examples
 */

import { existsSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const EXAMPLES_DIR = join(ROOT, 'journal-examples')
const JOURNAL_DIR = join(ROOT, 'journal')
const TARGET_DIR = join(ROOT, 'src', 'app', 'journal')

const forceExamples = process.argv.includes('--examples')

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
 * Copy entry subdirectories from a source directory into src/app/journal/
 */
function copyEntries(sourceDir, label) {
  if (!existsSync(sourceDir)) {
    console.log(`  ⚠ ${label} not found, skipping`)
    return 0
  }

  const entries = readdirSync(sourceDir)
  let count = 0

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry)
    if (!statSync(sourcePath).isDirectory()) continue

    const targetPath = join(TARGET_DIR, entry)
    cpSync(sourcePath, targetPath, { recursive: true })
    count++
  }

  return count
}

// --- Main ---

console.log('📄 Preparing journal content...\n')

cleanTarget()

let totalCopied = 0

// Always copy examples first
console.log('🔄 journal-examples/')
const exampleCount = copyEntries(EXAMPLES_DIR, 'journal-examples/')
console.log(`   → ${exampleCount} entries copied`)
totalCopied += exampleCount

// Then overlay real entries (unless --examples flag)
if (!forceExamples) {
  console.log('🔄 journal/')
  const realCount = copyEntries(JOURNAL_DIR, 'journal/')
  console.log(`   → ${realCount} entries copied`)
  totalCopied += realCount
} else {
  console.log('⏭ Skipping journal/ (--examples flag)')
}

console.log(`\n✅ Done! ${totalCopied} journal entries prepared.\n`)
