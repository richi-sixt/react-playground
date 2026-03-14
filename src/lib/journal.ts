
import glob from 'fast-glob'

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
  let entryFilenames = await glob('*/page.mdx', {
    cwd: './src/app/journal',
  })

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
