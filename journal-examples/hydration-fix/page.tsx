import { JournalLayout } from '@/components/JournalLayout'
import { MdxContent } from './MdxContent'

const entry = {
  title: 'Title of the journal entry',
  description:
    'Short-Description of the journal entry',
  date: '2025-03-17',
  category: 'development',
  tags: ['react', 'ssr', 'nextjs'],
  relatedApps: ['relatedApps-Name'],
  slug: 'hydration-fix',
}

export const metadata = {
  title: entry.title,
  description: entry.description,
}

export default function HydrationFixPage() {
  return (
    <JournalLayout entry={entry}>
      <MdxContent />
    </JournalLayout>
  )
}
