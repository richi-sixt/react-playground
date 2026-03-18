import { JournalLayout } from '@/components/JournalLayout'
import { MdxContent } from './MdxContent'
import { entry as baseEntry } from './page.en.mdx'

const entry = { ...baseEntry, slug: 'hydration-fix' }

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
