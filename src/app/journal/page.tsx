
import { Container } from '@/components/Container'
import { JournalHeader } from '@/components/JournalHeader'
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
      <JournalHeader />
      <div className="mt-16 sm:mt-20">
        <JournalList entries={entries} />
      </div>
    </Container>
  )
}
