import { JournalLayout } from '@/components/JournalLayout'
import { MdxContent } from './MdxContent'

const entry = {
  title: 'Fixing Hydration Mismatch in Memory Game',
  description:
    'How Math.random() causes SSR hydration errors and the solution using the mounted pattern.',
  date: '2025-03-17',
  category: 'development',
  tags: ['react', 'ssr', 'hydration', 'nextjs'],
  relatedApps: ['memory-game'],
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
