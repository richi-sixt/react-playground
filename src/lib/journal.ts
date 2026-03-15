import fs from 'node:fs'
import path from 'node:path'

interface JournalEntry {
  title: string
  description: string
  date: string
  category: string
  tags?: string[]
  relatedApps?: string[]
}

export interface JournalEntryWithSlug extends JournalEntry {
  slug: string
}

async function importEntry(
  entryFilename: string,
): Promise<JournalEntryWithSlug> {
  let { entry } = (await import(`../app/journal/${entryFilename}`)) as {
    default: React.ComponentType
    entry: JournalEntry
  }

  return {
    slug: entryFilename.replace(/(\/page)?\.mdx$/, ''),
    ...entry,
  }
}

export async function getAllJournalEntries() {
  let journalDir = path.join(process.cwd(), 'src/app/journal')
  let dirEntries = fs.readdirSync(journalDir, { withFileTypes: true })
  let entryFilenames = dirEntries
    .filter(
      (e) =>
        e.isDirectory() &&
        fs.existsSync(path.join(journalDir, e.name, 'page.mdx')),
    )
    .map((e) => `${e.name}/page.mdx`)

  let entries = await Promise.all(entryFilenames.map(importEntry))

  return entries.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getJournalEntriesForApp(appSlug: string) {
  let entries = await getAllJournalEntries()
  return entries.filter((e) => e.relatedApps?.includes(appSlug))
}

export async function getJournalCategories() {
  let entries = await getAllJournalEntries()
  return [...new Set(entries.map((e) => e.category))]
}
