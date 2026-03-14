
import { Container } from '@/components/Container'
import { JournalList } from '@/components/JournalList'
import { getAllJournalEntries } from '@/lib/journal'

export const metadata = {
  title: 'Journal',
  description:
    'Learnings, experiments, and notes from building apps with React.',
}

export default async function JournalPage() {
  let entries = await getAllJournalEntries()

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Journal
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Documenting my learnings and journey with
          React. Notes on patterns, bugs, and discoveries along the way.
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <JournalList entries={entries} />
      </div>
    </Container>
  )
}
