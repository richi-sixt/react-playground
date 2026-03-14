// Async server component wrapper — fetches journal entries and passes them to AppLayout.

import { AppLayout } from '@/components/AppLayout'
import { getJournalEntriesForApp } from '@/lib/journal'

export async function AppDetailLayout({
  app,
  children,
}: {
  app: {
    title: string
    description: string
    tech: string[]
    url?: string
    github?: string
    date: string
    category: 'games' | 'misc'
    slug?: string
  }
  children: React.ReactNode
}) {
  // Extract slug from the app URL: '/apps/memory-game/play/' → 'memory-game'
  let slug =
    app.slug || app.url?.match(/\/apps\/([^/]+)/)?.[1] || ''

  let journalEntries = await getJournalEntriesForApp(slug)

  return (
    <AppLayout app={{ ...app, slug }} journalEntries={journalEntries}>
      {children}
    </AppLayout>
  )
}
