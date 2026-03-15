import { JournalLayout } from '@/components/JournalLayout'
import { MdxContent } from './MdxContent'

const entry = {
  title: 'From Standalone to Static Export: Solving cPanel Process Limits',
  description:
    'How a Next.js standalone server hit process limits on shared hosting and why static export was the right solution.',
  date: '2026-03-14',
  category: 'development',
  tags: ['nextjs', 'cpanel', 'deployment', 'static-export', 'performance'],
  relatedApps: ['memory-game', 'tic-tac-toe'],
  slug: 'cPanel process limit fix',
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
